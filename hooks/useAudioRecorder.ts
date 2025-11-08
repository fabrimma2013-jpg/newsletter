import { useState, useRef, useCallback } from 'react';
// FIX: `LiveSession` is no longer an exported type from the `@google/genai` package.
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';
import { encode } from '../utils/audioUtils';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });


interface AudioRecorderOptions {
    onTranscriptionComplete: (fullTranscript: string) => void;
    onError: (error: Error) => void;
}

export const useAudioRecorder = ({ onTranscriptionComplete, onError }: AudioRecorderOptions) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');

    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    // FIX: The `LiveSession` type is not exported. The session promise can be typed as `Promise<any>`.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const fullTranscriptRef = useRef<string>('');

    const startRecording = useCallback(async () => {
        if (isRecording) return;
        setIsRecording(true);
        setTranscript('');
        fullTranscriptRef.current = '';

        try {
            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
            scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    inputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        scriptProcessorRef.current!.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessorRef.current!);
                        scriptProcessorRef.current!.connect(audioContextRef.current!.destination);
                    },
                    onmessage: (message: LiveServerMessage) => {
                        if(message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            setTranscript(prev => prev + text);
                            fullTranscriptRef.current += text;
                        }
                        if(message.serverContent?.turnComplete) {
                           // The turn is complete, but we will stop on user action
                        }
                    },
                    onclose: () => {
                        // console.log('Session closed');
                    },
                    onerror: (e) => {
                        console.error('Session error:', e);
                        onError(new Error('A session error occurred.'));
                        stopRecording();
                    },
                }
            });
        } catch (err) {
            console.error('Error starting recording:', err);
            onError(err instanceof Error ? err : new Error('Failed to start recording.'));
            setIsRecording(false);
        }
    }, [isRecording, onError]);

    const stopRecording = useCallback(() => {
        if (!isRecording) return;
        
        setIsRecording(false);
        
        sessionPromiseRef.current?.then(session => {
            session.close();
        }).catch(err => console.error("Error closing session: ", err));
        sessionPromiseRef.current = null;
        
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        
        audioContextRef.current?.close();
        audioContextRef.current = null;
        
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        
        onTranscriptionComplete(fullTranscriptRef.current);
        setTranscript('');

    }, [isRecording, onTranscriptionComplete]);
    
    return { isRecording, transcript, startRecording, stopRecording };
};
