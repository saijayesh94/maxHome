import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Alert from "@mui/material/Alert";
// import MicNoneIcon from '@mui/icons-material/MicNone';
import { useLocation } from "react-router-dom";
import { chartAPI, sendMail } from "../api/api";
import ChatHeader from "../components/ChatHeader/ChatHeader";
import ChatMessageItem from "../components/ChatBody/ChatMessageItem";
import SearchBar from "../components/ChatBody/SearchBar";

interface ChatMessage {
  role: "user" | "assistant" | "loading";
  content: string;
}

interface Payload {
  conversation: ChatMessage[];
  mini_dict: any;
  voicemode?: boolean;
}

function ChartUI() {
  const [conv, setConv] = useState<ChatMessage[]>([]);
  const [miniDict, setMiniDict] = useState<any>([]);
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(false);
  const [voice, setVoice] = useState<any>(false);
  const [voiceAudio, setVoiceAudio] = useState<any>("");
  const [pdfUrl, setPdfUrl] = useState<any>({});
  const [error, setError] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);
  // console.log('voice',voice)

  const location = useLocation();
  const { conversationData } = location.state || {};

  useEffect(() => {
    const sendMessage = async () => {
      await onMessageSend("hi", undefined, undefined);
    };
    sendMessage();
  }, []);

  const onMessageSend = async (
    data: string,
    voicemode?: boolean,
    editedConversation?: ChatMessage[]
  ) => {
    // console.log('previous messages conversation',editedConversation)
    try {
      let Conversation: ChatMessage[];
      let MINIDIC: any;
      if (editedConversation) {
        // If we're editing a message, use the edited conversation
        Conversation = editedConversation;
        const assistantresposne = editedConversation.filter(
          (item) => item.role === "assistant"
        ).length;
        // console.log('assiatnat resposnes in conversation',assistantresposne)
        MINIDIC = miniDict[assistantresposne - 1];
      } else {
        // For new messages, append to existing conversation
        Conversation = [...conv, { role: "user", content: data }];
        MINIDIC = miniDict?.length > 0 ? miniDict[miniDict?.length - 1] : {};
      }

      // Update UI immediately to show changes
      setConv([...Conversation, { role: "loading", content: "" }]);

      // const miniDictory = miniDict?.length > 0 ? miniDict[miniDict?.length -1] : {}

      const payload: Payload = {
        // conversation: [...conv, { role: 'user', content: data }],
        conversation: Conversation,
        mini_dict: MINIDIC,
        ...(voicemode !== undefined && { voicemode }),
      };
      // console.log('payload',payload)
      // setConv([...conv, { role: 'user', content: data }, { role: 'loading', content: '' }]);
      const resp = await chartAPI(payload);
      console.log("resp", resp);
      if (resp?.resp_obj?.status === "error") {
        setError(true);
        console.log("status: resp?.resp_obj?.status ======== error");
        // throw new Error("Invalid response from backend Error");
        return {
          status: resp?.resp_obj?.status,
        };
      }
      const updatedConversation = resp?.resp_obj?.conversation;
      setConv(updatedConversation);
      // setMiniDict(resp?.resp_obj?.mini_dict)
      setMiniDict((prevMiniDict: any) => [
        ...prevMiniDict,
        resp?.resp_obj?.mini_dict,
      ]);
      setVoiceAudio(resp?.resp_obj?.audio);
      setError(false);
      if (resp?.resp_obj?.url) {
        console.log("SETTING PDF URL", resp?.resp_obj?.url);
        setPdfUrl(resp.resp_obj?.url);
        const payloadMail = {
          pdf_fields: resp?.resp_obj?.resp_dict,
          envelope_args: resp?.resp_obj?.envelope_args,
        };
        const mailResp = await sendMail(payloadMail);
        // console.log("MAiL RES", mailResp)
      }
      // console.log('data in main', data);
      return {
        conversation: updatedConversation,
        voice: resp?.resp_obj?.audio, // Audio data as base64
        status: resp?.resp_obj?.status,
      };
    } catch (err) {
      console.error("Error sending message:", err);
      console.log("error");
      setError(true);
      setConv([]);
      setVoiceAudio("error");
      return {
        conversation: [{ role: "assistant", content: "error" }],
        voice: "error",
        status: "error",
      };
    }
  };

  const toggleVoiceMode = () => setIsVoiceMode((prev) => !prev);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      xs={12}
      sm={12}
      md={10}
      sx={{
        backgroundColor: "#F7F9FC",
        height: "100vh",
        margin: "0 auto",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      {error && (
        <Alert style={{ marginTop: "20px" }} severity="error">
          An Error Occured Please Try Again After Somethime.
        </Alert>
      )}
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ width: "90%" }}
      >
        <ChatHeader />
        {/* <ChatBody
          conv={conv}
          conversationData={conversationData}
          pdfUrl={pdfUrl}
          // onMessageSend={onMessageSend}
        /> */}
        <Grid
          container
          direction="column"
          sx={{
            flexGrow: 1,
            height: "40vh",
            overflow: "auto",
            width: "100%",
            scrollbarWidth: "none",
          }}
        >
          <ChatMessageItem
            apiData={conv}
            conversationData={conversationData}
            pdfUrl={pdfUrl}
            voiceAudio={voiceAudio}
            setVoiceAudio={setVoiceAudio}
            setPlayAudio={setPlayAudio}
            onMessageSend={onMessageSend}
          />
        </Grid>
      </Grid>

      <Grid
        sx={{
          position: "fixed",
          bottom: 20,
          width: "75%",
          paddingTop: "16px",
          zIndex: 9999999999999,
        }}
      >
        <SearchBar
          toggleVoiceMode={toggleVoiceMode}
          playAudio={playAudio}
          setPlayAudio={setPlayAudio}
          setVoice={setVoice}
          voice={voice}
          onMessageSend={onMessageSend}
          voiceAudio={voiceAudio}
        />
      </Grid>
    </Grid>
  );
}

export default ChartUI;
