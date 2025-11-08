import React, { useRef, useState } from 'react';
import { UserIcon, LogoIcon, PlayIcon, PauseIcon } from './icons';

export interface Message {
  role: 'user' | 'model';
  text: string;
  audioUrl?: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const onAudioPlay = () => setIsPlaying(true);
  const onAudioPauseOrEnd = () => setIsPlaying(false);

  return (
    <div className={`flex items-start gap-4 ${isModel ? '' : 'flex-row-reverse'}`}>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isModel ? 'bg-[#c5a382] text-white' : 'bg-stone-300 dark:bg-stone-600'
        }`}
      >
        {isModel ? <LogoIcon className="w-6 h-6"/> : <UserIcon />}
      </div>
      <div className={`max-w-xl px-4 py-3 rounded-lg shadow-md relative ${
          isModel
            ? 'bg-white dark:bg-stone-700'
            : 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        {isModel && message.audioUrl && (
            <>
                 <button 
                    onClick={handlePlayPause} 
                    className="absolute -bottom-4 right-2 p-1.5 bg-white dark:bg-stone-600 rounded-full shadow-lg hover:bg-stone-100 dark:hover:bg-stone-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c5a382] dark:focus:ring-offset-stone-700 transition"
                    aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <audio 
                    ref={audioRef} 
                    src={message.audioUrl} 
                    onPlay={onAudioPlay}
                    onPause={onAudioPauseOrEnd}
                    onEnded={onAudioPauseOrEnd}
                    hidden
                />
            </>
        )}
      </div>
    </div>
  );
};