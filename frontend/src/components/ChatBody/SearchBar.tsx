import React, { useState, KeyboardEvent, ChangeEvent, useEffect, useRef} from 'react';
import { Input, IconButton, Box, Divider, Tooltip } from '@mui/joy';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import SendIcon from '@mui/icons-material/Send';
import MicNoneIcon from '@mui/icons-material/MicNone';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface SearchBarProps {
  // onMessageSend: (message: string) => void
  onMessageSend:any;
  toggleVoiceMode: () => void;
  setVoice?:any
  voice?:any
  playAudio?:any
  setPlayAudio?:any
  voiceAudio?:any
}


const SearchBar: React.FC<SearchBarProps> = ({onMessageSend, toggleVoiceMode,setVoice,voice,playAudio,setPlayAudio,voiceAudio}) => {
  const [searchMessage, setSearchMessage] = useState<string>('');
  const [searchEnable, setSearchEnable] = useState<boolean>(false);
  const [messageCount, setMessageCount] = useState<number>(0);
  const [isVoiceInput, setIsVoiceInput] = useState<boolean>(true);
  const { transcript, listening, finalTranscript, resetTranscript, browserSupportsSpeechRecognition } =
  useSpeechRecognition();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // console.log('playAudio',playAudio)

  useEffect(() => {
    if (listening && transcript){
      // setIsVoiceInput(true); // Set flag for voice input
      setVoice(true); 
      setSearchMessage(transcript);
      setSearchEnable(true);
      if (inputRef.current) {
        const inputElement = inputRef.current.querySelector('input'); // Get the native input element
        if (inputElement) {
          inputElement.focus();
          inputElement.selectionStart = transcript.length;
          inputElement.selectionEnd = transcript.length;
          inputElement.scrollLeft = inputElement.scrollWidth;
        }
      }
    }
  }, [transcript]);

  useEffect(() => {
    if (finalTranscript) {
      if (onMessageSend) {
        SpeechRecognition.stopListening();
        resetTranscript()
        onMessageSend(searchMessage,true);
        setSearchMessage('');
      }
    }
  }, [finalTranscript]);

  useEffect(() => {
    // Start listening again once audio playback is finished
    if (playAudio && voiceAudio !== 'done') {
      setPlayAudio(false)
      SpeechRecognition.startListening({continuous:true});
    }
  }, [playAudio]);

  const onSend = async () => {
    if (searchMessage.trim().length > 0) {
      setSearchEnable(true)
      setSearchMessage('');
      // console.log('message', searchMessage);
      const response = await onMessageSend(searchMessage);
      console.log('response',response)
      if(response?.status === 'error'){
        console.log('status error recall api')
        onMessageSend(searchMessage)
      }else{
        console.log('status ongoing')
      }
      setSearchEnable(false)
      setMessageCount(prevCount => prevCount + 1);
    }else{
      setSearchEnable(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // console.log('KEYPRESS');
      onSend();
      // setIsVoiceInput(false);
      setVoice(false);
      setSearchEnable(false)
    }
  };

  const handleAudioClick = () => {
    // toggleVoiceMode()
    if(isVoiceInput){
      setIsVoiceInput(false);
      setVoice(true);
      SpeechRecognition.startListening({continuous:true});
    }else{
      setIsVoiceInput(true)
      SpeechRecognition.stopListening();
    }
  };

  const suffix = (
    <>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {browserSupportsSpeechRecognition && (
        <Tooltip title={isVoiceInput ? 'Tap to Start Listening' : "Tap to Stop Listening"} placement="top">
          <IconButton
            variant="plain"
            onClick={handleAudioClick}
            style={{ backgroundColor: listening ? 'red' : undefined }}
          >
            <MicNoneIcon />
          </IconButton>
          {/* <Fab 
            size="small"
            color="secondary" 
            aria-label="voice mode"
            onClick={handleAudioClick}
          >
            <MicNoneIcon />
          </Fab> */}
        </Tooltip>
       )} 
        <IconButton variant="plain">
          <AttachFileIcon />
        </IconButton>
        <IconButton variant="plain">
          <CropOriginalIcon />
        </IconButton>
        <Divider orientation="vertical" inset="none" />
        <IconButton variant="plain" onClick={onSend} 
        sx={{backgroundColor: searchEnable ? '#2160EB': '#F2F4F7', color: searchEnable ?'white' : '#8C93A1', 
            '&:hover': {
              backgroundColor: searchEnable ? '#2160EB': '#F2F4F7',
              borderColor: '#2160EB',
              boxShadow: 'none',
              color: searchEnable ?'white' : '#8C93A1',
            },
        }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </>
  );

  return (
    <Input
      size="lg"
      placeholder={messageCount === 0 ? "Say Hello To start Conversation" : "Enter Message"}
      endDecorator={suffix}
      ref={inputRef}
      value={searchMessage}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setSearchMessage(e.target.value);
        if (e.target.value.length > 0) {
          setSearchEnable(true);
        }else{
          setSearchEnable(false);
        }
      }}
      onKeyDown={handleKeyPress}
      sx={{
        borderRadius: '12px',
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '20px',
        paddingRight: '20px',
        fontFamily: 'Inter, sans-serif !important',
        fontSize: '14px',
        lineHeight: '16px',
      }}
    />
  );
};

export default SearchBar;
