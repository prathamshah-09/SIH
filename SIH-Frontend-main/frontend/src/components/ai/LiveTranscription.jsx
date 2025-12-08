import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Mic, MicOff, Loader } from 'lucide-react';

const LiveTranscription = ({ theme, onFinalTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if SpeechRecognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        if (finalTranscript) {
          onFinalTranscript && onFinalTranscript({
            id: Date.now(),
            text: finalTranscript,
            isBot: false,
            timestamp: new Date()
          });
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onFinalTranscript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
        <div className="text-center">
          <h3 className={`text-xl font-bold ${theme.colors.text}`}>
            Speech Recognition Not Supported
          </h3>
          <p className={`${theme.colors.muted} mt-2`}>
            Your browser doesn't support speech recognition. Please use a modern browser like Chrome.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <div className="text-center space-y-4">
        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
          isListening
            ? "bg-gradient-to-br from-red-400 to-red-600 animate-pulse"
            : "bg-gradient-to-br from-cyan-400 to-blue-600"
        }`}>
          <Mic className="w-16 h-16 text-white" />
        </div>

        <h3 className={`text-2xl font-bold ${theme.colors.text}`}>
          Live Voice Transcription
        </h3>

        <p className={`${theme.colors.muted} text-lg`}>
          {isListening ? 'Listening... Speak clearly.' : 'Click start to begin voice transcription.'}
        </p>

        {transcript && (
          <div className={`mt-4 p-4 rounded-lg ${theme.colors.card} max-w-md`}>
            <p className="text-sm opacity-70">Transcript:</p>
            <p className="mt-2">{transcript}</p>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        {!isListening ? (
          <Button
            onClick={startListening}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-6 text-lg"
          >
            <Mic className="w-6 h-6 mr-2" />
            Start Listening
          </Button>
        ) : (
          <Button
            onClick={stopListening}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-6 text-lg"
          >
            <MicOff className="w-6 h-6 mr-2" />
            Stop Listening
          </Button>
        )}
      </div>

      <div className={`text-sm ${theme.colors.muted} text-center max-w-md`}>
        <p>Click "Start Listening" to begin real-time voice transcription.</p>
        <p className="mt-2">Your speech will be transcribed and sent as a message.</p>
      </div>
    </div>
  );
};

export default LiveTranscription;
