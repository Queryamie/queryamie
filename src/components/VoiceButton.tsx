import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, Square, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface VoiceButtonProps {
  onVoiceMessage: (message: string) => void;
  disabled?: boolean;
  chatId: string;
}

type RecordingState = 'idle' | 'recording' | 'processing' | 'error';

const VoiceButton: React.FC<VoiceButtonProps> = ({ 
  onVoiceMessage, 
  disabled = false, 
  chatId 
}) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  // Removed unused audioBlob state
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(16).fill(0));
  
  const audioChunks = useRef<Blob[]>([]);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const animationFrame = useRef<number | null>(null);
  const maxRecordingTime = 300; // 5 minutes max

  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermission(permissionStatus.state);
      permissionStatus.addEventListener('change', () => {
        setPermission(permissionStatus.state);
      });
    } catch (error) {
      console.warn('Permission API not supported');
    }
  };

  const setupAudioAnalysis = (stream: MediaStream) => {
    try {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current.fftSize = 512;
      analyser.current.smoothingTimeConstant = 0.7;
      source.connect(analyser.current);
      setTimeout(() => {
        startAudioVisualization();
      }, 100);
    } catch (error) {
      console.error('Audio analysis setup failed:', error);
    }
  };

  const startAudioVisualization = () => {
    if (!analyser.current) return;
    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const bands = 16;
    const bandSize = Math.floor(bufferLength / bands);
    const updateAudioLevels = () => {
      if (recordingState !== 'recording' || !analyser.current) return;
      analyser.current.getByteFrequencyData(dataArray);
      const newLevels: number[] = [];
      for (let i = 0; i < bands; i++) {
        let sum = 0;
        const start = i * bandSize;
        const end = start + bandSize;
        for (let j = start; j < end && j < bufferLength; j++) {
          sum += dataArray[j];
        }
        const average = sum / bandSize;
        let level = average / 255;
        newLevels.push(Math.min(1, level));
      }
      setAudioLevels(newLevels);
      animationFrame.current = requestAnimationFrame(updateAudioLevels);
    };
    updateAudioLevels();
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      setupAudioAnalysis(stream);
      const preferredMimeType = 'audio/mp4';
      const fallbackMimeType = 'audio/webm;codecs=opus';
      const mimeType = MediaRecorder.isTypeSupported(preferredMimeType) 
        ? preferredMimeType 
        : fallbackMimeType;
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error(`Neither ${preferredMimeType} nor ${fallbackMimeType} is supported by this browser`);
      }
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunks.current = [];
      setRecordingTime(0);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { 
          type: recorder.mimeType 
        });
        // Removed setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }
        if (audioContext.current) {
          audioContext.current.close();
          audioContext.current = null;
        }
        setAudioLevels(new Array(16).fill(0));
        processVoiceMessage(audioBlob);
      };
      recorder.start(1000);
      setMediaRecorder(recorder);
      setRecordingState('recording');
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxRecordingTime) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } catch (error: any) {
      console.error('Recording error:', error); // Log full error details
      setError(error.message || 'Microphone access denied or not available');
      setRecordingState('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recordingState === 'recording') {
      mediaRecorder.stop();
      setRecordingState('processing');
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }
    }
  };

  const processVoiceMessage = async (audioBlob: Blob) => {
    try {
      setRecordingState('processing');
      setError(null);
      const formData = new FormData();
      const fileExtension = audioBlob.type.includes('audio/mp4') || audioBlob.type.includes('audio/m4a')
        ? 'voice-message.m4a'
        : 'voice-message.webm';
      formData.append('file', audioBlob, fileExtension);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/voice/transcribe?chat_id=${chatId}&language=auto&enhance_quality=true`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );
      const { transcription } = response.data;
      if (transcription && transcription.trim()) {
        onVoiceMessage(transcription.trim());
      } else {
        setError('No speech detected. Please try again.');
      }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please try with a shorter recording.');
      } else if (error.response?.status === 413) {
        setError('Audio file too large. Please record a shorter message.');
      } else if (error.response?.status === 400) {
        setError('No speech detected or invalid audio format.');
      } else if (error.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else {
        setError('Failed to process voice message. Please try again.');
      }
    } finally {
      setRecordingState('idle');
      setRecordingTime(0);
      // Removed setAudioBlob(null);
    }
  };

  const handleVoiceButtonClick = () => {
    if (recordingState === 'idle') {
      startRecording();
    } else if (recordingState === 'recording') {
      stopRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getButtonColor = () => {
    switch (recordingState) {
      case 'recording':
        return 'bg-red-600 hover:bg-red-700 border-red-500';
      case 'processing':
        return 'bg-yellow-600 hover:bg-yellow-700 border-yellow-500';
      case 'error':
        return 'bg-red-800 hover:bg-red-900 border-red-700';
      default:
        return 'bg-gray-700 hover:bg-gray-600 border-gray-600';
    }
  };

  const getButtonIcon = () => {
    switch (recordingState) {
      case 'recording':
        return <Square className="h-4 w-4" />;
      case 'processing':
        return <Loader className="h-4 w-4 animate-spin" />;
      case 'error':
        return <MicOff className="h-4 w-4" />;
      default:
        return permission === 'denied' ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />;
    }
  };

  const isButtonDisabled = () => {
    return (
      disabled ||
      recordingState === 'processing' ||
      permission === 'denied' ||
      !chatId
    );
  };

  const getTooltipText = () => {
    if (permission === 'denied') return 'Microphone access denied';
    if (!chatId) return 'Please upload documents first';
    if (recordingState === 'recording') return `Recording... ${formatTime(recordingTime)}`;
    if (recordingState === 'processing') return 'Processing voice message...';
    if (recordingState === 'error') return error || 'Error occurred';
    return 'Click to record voice message';
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex flex-col items-center">
        <Button
          onClick={handleVoiceButtonClick}
          disabled={isButtonDisabled()}
          className={`relative flex items-center justify-center rounded-full w-12 h-12 p-0 transition-all duration-200 ${getButtonColor()}`}
          title={getTooltipText()}
          style={{ minWidth: 0, minHeight: 0 }}
        >
          {getButtonIcon()}
          {/* Minimal waveform inside button when recording */}
          {recordingState === 'recording' && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-end h-3 w-8">
              {audioLevels.map((level, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white/80 rounded"
                  style={{ width: 2, height: `${6 + level * 10}px`, marginLeft: idx === 0 ? 0 : 1 }}
                  animate={{ height: 6 + level * 10 }}
                  transition={{ duration: 0.08, ease: 'easeOut' }}
                />
              ))}
            </div>
          )}
        </Button>
        {/* Timer below button when recording */}
        <AnimatePresence>
          {recordingState === 'recording' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="text-xs text-gray-400 mt-1"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatTime(recordingTime)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Error message below button */}
      <AnimatePresence>
        {error && recordingState === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="mt-2 bg-red-800 text-white px-2 py-1 rounded text-xs shadow border border-red-600 max-w-xs text-center"
          >
            <div>{error}</div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-200 hover:text-white mt-1 underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Processing indicator below button */}
      <AnimatePresence>
        {recordingState === 'processing' && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="mt-2 bg-yellow-700 text-white px-2 py-1 rounded text-xs shadow border border-yellow-600 text-center"
          >
            Processing voice...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceButton;