import React, { useState, useRef, KeyboardEvent } from 'react';
import { MicIcon, SendIcon, StopCircleIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  transcript: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isRecording,
  startRecording,
  stopRecording,
  transcript,
}) => {
  const [inputValue, setInputValue] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const message = isRecording ? transcript : inputValue;
    if (message.trim()) {
      onSendMessage(message.trim());
      setInputValue('');
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        handleSend();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const displayValue = isRecording ? transcript : inputValue;

  return (
    <div className="flex-shrink-0 p-4 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700">
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textAreaRef}
            value={displayValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "Enregistrement en cours... Parlez maintenant." : "Posez une question sur votre santé..."}
            className="w-full p-3 pr-12 border border-stone-300 dark:border-stone-600 rounded-lg shadow-sm bg-stone-50 dark:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c5a382] resize-none overflow-y-auto max-h-40"
            rows={1}
            disabled={isLoading || isRecording}
            aria-label="Message input"
          />
        </div>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className={`p-3 rounded-full transition-colors ${
            isRecording
              ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
              : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <StopCircleIcon /> : <MicIcon />}
        </button>
        <button
          onClick={handleSend}
          disabled={isLoading || (!inputValue.trim() && !isRecording)}
          className="p-3 bg-[#c5a382] text-white rounded-full hover:bg-[#b89572] transition-colors disabled:bg-stone-300 dark:disabled:bg-stone-600 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};