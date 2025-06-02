
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Mic, MapPin, Send, Smile, StopCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'file' | 'location' | 'voice') => void;
  chatId: string;
}

export function MessageInput({ onSendMessage, chatId }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Cleanup function to stop recording and release media resources
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSend = () => {
    if (message.trim() === '') return;
    onSendMessage(message, 'text');
    setMessage('');
  };

  const handleMicClick = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob); // Or convert to Data URL if preferred

          // To convert to Data URL (larger string, but self-contained)
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              onSendMessage(reader.result, 'voice');
            } else {
               toast({
                variant: 'destructive',
                title: 'Recording Error',
                description: 'Could not process recorded audio.',
              });
            }
          };
          reader.readAsDataURL(audioBlob);


          // Clean up stream tracks
          stream.getTracks().forEach(track => track.stop());
          audioStreamRef.current = null;
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({
          title: "Recording Started",
          description: "Click the stop button to finish recording.",
        });
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings.',
        });
        setIsRecording(false);
      }
    }
  };
  
  const handleFeatureClick = (featureName: string) => {
    toast({
      title: `${featureName} Feature`,
      description: `${featureName} functionality is not yet implemented in this demo.`,
    });
  };

  const emojis = ["😀", "😂", "😍", "🤔", "👍", "🙏", "🔥", "🎉"];

  return (
    <div className="sticky bottom-0 border-t bg-background p-3 md:p-4">
      <div className="relative flex items-end gap-2">
        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          className="min-h-[48px] max-h-32 flex-1 resize-none rounded-full px-5 py-3 pr-28 shadow-sm focus-visible:ring-1"
        />
        <div className="absolute right-16 bottom-2 flex items-center gap-0.5">
           <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
                <Smile size={22} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 mb-1">
              <div className="grid grid-cols-4 gap-1">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="icon"
                    className="text-xl"
                    onClick={() => setMessage(prev => prev + emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary" onClick={() => handleFeatureClick('File Sharing')}>
            <Paperclip size={22} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary md:hidden" onClick={handleMicClick}>
            {isRecording ? <StopCircle size={22} className="text-destructive animate-pulse" /> : <Mic size={22} />}
          </Button>
        </div>
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-md"
          onClick={handleSend}
          disabled={message.trim() === '' || isRecording}
        >
          <Send size={22} />
        </Button>
      </div>
      <div className="mt-2 flex gap-2 justify-start md:justify-end">
        <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={handleMicClick}>
          {isRecording ? <StopCircle size={16} className="mr-2 text-destructive animate-pulse" /> : <Mic size={16} className="mr-2" />}
          {isRecording ? 'Stop Recording' : 'Voice Message'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleFeatureClick('Location Sharing')}>
          <MapPin size={16} className="mr-2" /> Share Location
        </Button>
      </div>
    </div>
  );
}
