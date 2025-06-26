import React, { useEffect, useRef, useState } from "react";
import {
  List,
  ListItem,
  ListItemContent,
  Typography,
  Card,
  CardContent,
  Skeleton,
  Box,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Input } from "@mui/joy";

interface ChatMessage {
  role: "user" | "assistant" | "loading";
  content: string;
  id?: string; // Add unique identifier for messages
}

interface ChatMessageItemProps {
  apiData: ChatMessage[];
  conversationData: ChatMessage[];
  pdfUrl: string;
  voiceAudio?: any;
  setVoiceAudio?: any;
  setPlayAudio?: any;
  onMessageSend?: (
    message: string,
    isVoice?: boolean,
    editedConversation?: ChatMessage[]
  ) => void;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  apiData,
  conversationData,
  pdfUrl,
  voiceAudio,
  setVoiceAudio,
  setPlayAudio,
  onMessageSend,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [streamingResponse, setStreamingResponse] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // setLocalMessages([...conversationData] || [...apiData] || []);
    setLocalMessages(conversationData || apiData);
    // console.log('localmessages',localMessages)
  }, [conversationData, apiData]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [apiData, streamingResponse, localMessages]);

  useEffect(() => {
    console.log("local message", localMessages);
  }, [localMessages]);

  // const playAudioFromBase64 = (base64String: string) => {
  //   console.log("voice triggered");
  //   try {
  //     const base64 = base64String;
  //     const binaryString = atob(base64);
  //     const binaryArray = new Uint8Array(binaryString.length);

  //     for (let i = 0; i < binaryString.length; i++) {
  //       binaryArray[i] = binaryString.charCodeAt(i);
  //     }

  //     const audioBlob = new Blob([binaryArray], { type: "audio/mpeg" });
  //     const audioUrl = URL.createObjectURL(audioBlob);
  //     const audio = new Audio(audioUrl);

  //     audio.onended = () => {
  //       URL.revokeObjectURL(audioUrl);
  //       setPlayAudio(true);
  //       console.log("voice ended");
  //     };

  //     audio.onerror = (err) => {
  //       console.error("Audio playback error:", err);
  //       URL.revokeObjectURL(audioUrl);
  //       setPlayAudio(true);
  //     };

  //     audio.play();
  //     console.log("voice playing");
  //   } catch (err) {
  //     console.log("voice err", err);
  //     setPlayAudio(true);
  //   }
  // };

  const playAudioFromBase64 = (base64String: string) => {
    console.log("voice triggered");
    try {
      const base64 = base64String;
      const binaryString = atob(base64);
      const binaryArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryArray[i] = binaryString.charCodeAt(i);
      }

      const audioBlob = new Blob([binaryArray], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio();

      // Set up event listeners before setting the source
      audio.addEventListener("ended", () => {
        URL.revokeObjectURL(audioUrl);
        setPlayAudio(true);
        console.log("voice ended");
      });

      // Ignore the initial error event since we know it might occur
      audio.addEventListener("error", () => {
        // Only handle actual playback failures
        if (audio.error?.code !== MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
          console.error("Actual playback error:", audio.error);
          URL.revokeObjectURL(audioUrl);
          setPlayAudio(true);
        }
      });

      // Set source and play
      audio.src = audioUrl;

      // Wait for the audio to be loaded before playing
      audio.addEventListener("canplaythrough", () => {
        audio.play().catch((err) => {
          console.error("Playback failed:", err);
          URL.revokeObjectURL(audioUrl);
          setPlayAudio(true);
        });
      });
    } catch (err) {
      console.error("Audio processing error:", err);
      setPlayAudio(true);
    }
  };

  useEffect(() => {
    console.log("voice Audio useEffect");
    if (voiceAudio && voiceAudio !== "error") {
      // const latestMessage = apiData[apiData.length - 1];
      const latestMessage = localMessages[localMessages.length - 1];
      console.log("latest message", latestMessage);
      // console.log('1')
      // try {
      //   const parseContent = JSON.parse(latestMessage?.content);
      //   // console.log('2')
      //   if (parseContent?.response === "none") {
      //     // console.log("3")
      //     playAudioFromBase64(HardedCodeVoice);
      //     setVoiceAudio("done");
      //     // console.log('harded voice')
      //   } else {
      //     // console.log("4")
      //     // console.log('voice normal')
      //     playAudioFromBase64(voiceAudio);
      //   }
      // } catch (err) {
      //   // console.log("5")
      //   console.log("err at voice useEffect call", err);
      // }
      try {
        const parseContent = JSON.parse(latestMessage?.content);
        playAudioFromBase64(voiceAudio);
        if (parseContent?.response === "none") {
          setVoiceAudio("done");
        }
      } catch (err) {
        console.log("err at voice useEffect call", err);
      }
    }
  }, [voiceAudio, localMessages]);

  const handleEdit = (messageId: string, content: string) => {
    // console.log('id, message',messageId,content)
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  // const handleSaveEdit = (messageId: string) => {
  //   if (editingContent.trim()) {
  //     // Find the index of the edited message
  //     const editedMessageIndex = messages.findIndex(msg => msg.id === messageId);
  //     console.log('eduted messageIndex',editedMessageIndex)
  //     if (editedMessageIndex !== -1) {
  //       // Get all messages up to and including the edited message
  //       let previousMessages = messages.slice(0, editedMessageIndex + 1);
  //       // Update the edited message's content
  //       console.log('previous messages',previousMessages)
  //       previousMessages[editedMessageIndex].content = editingContent;

  //       // Send the edited conversation to backend
  //       if(onMessageSend){
  //         onMessageSend(editingContent);
  //       }
  //     }
  //   }
  //   setEditingMessageId(null);
  //   setEditingContent('');
  // };

  const handleSaveEdit = async (messageId: string) => {
    // console.log('1')
    if (editingContent.trim()) {
      // console.log('2')
      const editedMessageIndex = messages.findIndex(
        (msg) => msg.id === messageId
      );
      console.log("editInex", editedMessageIndex);
      if (editedMessageIndex !== -1) {
        // console.log('3')
        const previousMessages = [...messages.slice(0, editedMessageIndex + 1)];
        previousMessages[editedMessageIndex] = {
          ...previousMessages[editedMessageIndex],
          content: editingContent,
        };
        // console.log('previous message',previousMessages)
        setLocalMessages(previousMessages);

        try {
          // console.log('4')
          // Call API with edited conversation
          setEditingMessageId(null);
          if (onMessageSend) {
            // console.log('5')
            const result = await onMessageSend(
              editingContent,
              false,
              previousMessages
            );
            console.log("Edit API response:", result);
          }
        } catch (error) {
          console.error("Error saving edit:", error);
          // console.log('7')
          // Optionally revert local state on error
          // setLocalMessages(conversationData || apiData);
        }
      }
    }
    // setEditingMessageId(null);
    setEditingContent("");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  const streamText = (content: string) => {
    setIsStreaming(true);
    setStreamingResponse("");
    const chars = content.split("");
    chars.forEach((char, index) => {
      setTimeout(() => {
        setStreamingResponse((prev) => prev + char);
        if (index === chars.length - 1) {
          setIsStreaming(false);
        }
      }, index * 50);
    });
  };

  const parseContent = (
    content: string,
    role: "user" | "assistant" | "loading"
  ) => {
    const hardCodedData = [
      <Typography
        sx={{
          textAlign: "left",
          color: "#2B3340",
          fontFamily: "Inter, sans-serif !important",
          fontSize: "14px",
          lineHeight: "16px",
          fontWeight: "Medium",
          alignItems: "center",
        }}
      >
        Yay! Your offer is ready. We'll send this to you on your email as well.
      </Typography>,
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CheckCircleOutlineIcon
            sx={{
              backgroundColor: "#038A01",
              color: "white",
              borderRadius: "25px",
              fontSize: "14px",
              marginRight: "8px",
            }}
          />
          <Typography
            sx={{
              textAlign: "left",
              color: "#2B3340",
              fontFamily: "Inter, sans-serif !important",
              fontSize: "14px",
              lineHeight: "16px",
              fontWeight: "Medium",
            }}
          >
            Purchase Offer.pdf
          </Typography>
        </Box>
        <Typography
          sx={{
            textAlign: "left",
            color: "gray",
            fontFamily: "Inter, sans-serif !important",
            fontSize: "14px",
            lineHeight: "16px",
            fontWeight: "Medium",
          }}
        >
          2.2 MB
        </Typography>
      </Box>,
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Button
          variant="text"
          sx={{
            color: "#2160EB",
            textTransform: "none",
            fontSize: "14px",
            "&:hover": {
              backgroundColor: "white",
            },
            fontFamily: "Inter, sans-serif !important",
          }}
          onClick={() => navigate("/edit-offer", { state: { pdfUrl } })}
        >
          View & Edit Offer
        </Button>
      </Box>,
    ];

    if (role === "assistant") {
      try {
        const parsed = JSON.parse(content);
        if (parsed.response === "none") {
          return hardCodedData;
        } else {
          return [parsed.response];
        }
      } catch (error) {
        console.error("Error parsing content:", error);
      }
    }
    return [content];
  };

  useEffect(() => {
    console.log("streminng useeffect");
    try {
      // const latestMessage = apiData[apiData.length - 1];
      const latestMessage = localMessages[localMessages.length - 1];
      const parseContent = JSON.parse(latestMessage?.content);
      if (latestMessage?.role === "assistant" && voiceAudio) {
        streamText(parseContent?.response);
      }
    } catch (err) {
      console.log("err", err);
    }
    // }, [apiData]);
  }, [localMessages]);

  // Add unique IDs to messages if they don't have them
  const messages = localMessages.map((msg, index) => ({
    ...msg,
    id: msg?.id || `msg-${index}}`,
  }));

  // console.log('messages',messages)

  return (
    <List>
      {messages.flatMap((data, index) =>
        parseContent(data.content, data.role).map((item, subIndex) => (
          <ListItem
            key={`${data.id}-${subIndex}`}
            sx={{
              justifyContent: data.role === "user" ? "flex-end" : "flex-start",
              display: "flex",
              padding: "8px 0",
            }}
          >
            <ListItemContent
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                // maxWidth: "40%",
                alignItems: data.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {data.role === "loading" ? (
                <Skeleton animation="wave" sx={{ width: "40%" }} />
              ) : (
                <>
                  {editingMessageId === data.id ? (
                    <Box sx={{ width: "40%", justifyContent: "flex-end" }}>
                      <Input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        sx={{
                          color: "black",
                          backgroundColor: "#FFFFFF",
                          padding: "8px",
                          borderRadius: "4px",
                          width: "100%",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <IconButton
                          onClick={() => handleSaveEdit(data.id)}
                          size="sm"
                          sx={{ color: "#666" }}
                        >
                          <DoneIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={handleCancelEdit}
                          size="sm"
                          sx={{ color: "#666" }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ) : data.role === "user" && index === 0 ? null : (
                    <Box
                      sx={{
                        position: "relative",
                        // border:'1px solid black',
                        // width: data.role === "user" ? "fit-content" : "40%",
                        maxWidth: data.role === "user" ? "40%" : "40%",
                        minWidth: data.role === "assistant" ? "40%" : undefined,
                        "&:hover .edit-button": {
                          opacity: 1, // Show the button on hover
                        },
                      }}
                    >
                      <Card
                        sx={{
                          width: "100%",
                          backgroundColor:
                            data.role === "user" ? "#2160EB" : "#FFFFFF",
                        }}
                      >
                        <CardContent>
                          <Typography
                            sx={{
                              position: "relative",
                              // textAlign:
                              //   data.role === "user" ? "right" : "left",
                              textAlign: "left",
                              color:
                                data.role === "user" ? "#FFFFFF" : "#2B3340",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "14px",
                              lineHeight: "16px",
                              fontWeight: 500,
                            }}
                          >
                            {voiceAudio &&
                            data.role === "assistant" &&
                            index === messages.length - 1 &&
                            isStreaming
                              ? streamingResponse
                              : item}
                          </Typography>
                        </CardContent>
                      </Card>
                      {data.role === "user" && (
                        <IconButton
                          onClick={() => handleEdit(data.id, data.content)}
                          size="sm"
                          className="edit-button" // Add a class for targeting
                          // sx={{
                          //   opacity: 0, // Initially hidden
                          //   transition: 'opacity 0.2s',
                          //   transform: 'translateY(-50%)', // Center vertically
                          //   '&:hover': {
                          //     opacity: 1, // Show on hover
                          //   },
                          // }}
                          sx={{
                            opacity: 0, // Initially hidden
                            // transition: 'opacity 0.2s',
                            // transition: 'opacity 0.1s ease-in-out',
                            position: "absolute",
                            bottom: "20px", // Adjust as needed
                            right: "101%", // Adjust as needed
                            "&:hover": { opacity: 1 },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  )}
                </>
              )}
            </ListItemContent>
          </ListItem>
        ))
      )}
      <div ref={bottomRef} />
    </List>
  );
};

export default ChatMessageItem;
