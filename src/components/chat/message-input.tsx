
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Mic, MapPin, Send, Smile, StopCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useI18n } from '@/lib/i18n/client';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'file' | 'location' | 'voice') => void;
  chatId: string;
}

export function MessageInput({ onSendMessage, chatId }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const t = useI18n();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
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
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
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
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              onSendMessage(reader.result, 'voice');
            } else {
               toast({
                variant: 'destructive',
                title: t('messageInput.recordingErrorTitle'),
                description: t('messageInput.recordingErrorDescription'),
              });
            }
          };
          reader.readAsDataURL(audioBlob);
          stream.getTracks().forEach(track => track.stop());
          audioStreamRef.current = null;
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({
          title: t('messageInput.recordingStartedTitle'),
          description: t('messageInput.recordingStartedDescription'),
        });
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          variant: 'destructive',
          title: t('messageInput.micAccessDeniedTitle'),
          description: t('messageInput.micAccessDeniedDescription'),
        });
        setIsRecording(false);
      }
    }
  };
  
  const handleFeatureClick = (featureNameKey: string) => {
    const featureName = t(featureNameKey as any);
    toast({
      title: t('chatHeader.featureNotImplemented', {featureName}), // Reusing general key
      description: t('chatHeader.featureNotImplementedDescription', {featureName}),
    });
  };

  const emojis = ["😀", "😂", "😍", "🤔", "👍", "🙏", "🔥", "🎉"];

  return (
    <div className="sticky bottom-0 border-t bg-background p-3 md:p-4">
      <div className="relative flex items-end gap-2">
        <Textarea
          placeholder={t('messageInput.placeholder')}
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

          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary" onClick={() => handleFeatureClick('messageInput.fileSharingFeature')}>
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
          {isRecording ? t('messageInput.stopRecordingButton') : t('messageInput.voiceMessageButton')}
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleFeatureClick('messageInput.locationSharingFeature')}>
          <MapPin size={16} className="mr-2" /> {t('messageInput.locationSharingFeature')}
        </Button>
      </div>
    </div>
  );
}
