import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Upload,
  Mic,
  Square,
  ShieldCheck,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { CallRecording } from '../../types/crm';
import { useCrm } from '../../context/CrmContext';

interface Props {
  recording: CallRecording;
}

export const CallRecordingPlayer: React.FC<Props> = ({ recording }) => {
  const { logAudit, updateCallRecording } = useCrm();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [micTime, setMicTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const duration = recording.durationSeconds || 600;

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Sync with audio element if audioUrl exists
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (gainRef.current) {
      gainRef.current.gain.value = isMuted ? 0 : volume * 0.08;
    }
  }, [playbackRate, isMuted, volume]);

  // Handle Play/Pause
  const startSyntheticAudio = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Create gentle VoIP speech-simulation carrier tone
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtxRef.current.currentTime);

      gain.gain.setValueAtTime(isMuted ? 0 : volume * 0.08, audioCtxRef.current.currentTime);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch {
      // AudioContext not allowed or unsupported
    }
  }, [isMuted, volume]);

  const stopSyntheticAudio = useCallback(() => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // ignore
      }
      oscRef.current = null;
    }
  }, []);

  // Playback timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      if (recording.audioUrl && audioRef.current) {
        audioRef.current.play().catch(() => {});
      } else {
        startSyntheticAudio();
      }

      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            stopSyntheticAudio();
            return 0;
          }
          return prev + 1 * playbackRate;
        });
      }, 1000);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSyntheticAudio();
    }

    return () => {
      clearInterval(interval);
      stopSyntheticAudio();
    };
  }, [isPlaying, duration, playbackRate, recording.audioUrl, startSyntheticAudio, stopSyntheticAudio]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSyntheticAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopSyntheticAudio]);

  const togglePlay = () => {
    if (!isPlaying) {
      logAudit(
        'RECORDING_PLAYBACK_AUDITED',
        'calls',
        `User initiated audio playback for call ${recording.id} (${recording.customerName})`
      );
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSkip = (seconds: number) => {
    const nextTime = Math.min(Math.max(0, currentTime + seconds), duration);
    setCurrentTime(nextTime);
    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }
  };

  const handleWaveformClick = (index: number, totalBars: number) => {
    const fraction = index / totalBars;
    const seekTime = fraction * duration;
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  // Upload custom audio file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const testAudio = new Audio(url);
      testAudio.onloadedmetadata = () => {
        const fileDuration = Math.round(testAudio.duration) || duration;
        updateCallRecording(recording.id, {
          audioUrl: url,
          durationSeconds: fileDuration,
          recordingStatus: 'Available',
          consentObtained: true,
        });
        logAudit('AUDIO_FILE_ATTACHED', 'calls', `Uploaded real audio file "${file.name}" for call ${recording.id}`);
      };
    }
  };

  // Live Microphone Recording
  const startMicRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        updateCallRecording(recording.id, {
          audioUrl,
          durationSeconds: micTime || 30,
          recordingStatus: 'Available',
          consentObtained: true,
        });
        setIsRecordingMic(false);
        setMicTime(0);
        logAudit('MIC_RECORDING_CAPTURED', 'calls', `Captured microphone audio recording for call ${recording.id}`);
      };

      mediaRecorder.start();
      setIsRecordingMic(true);
      setMicTime(0);
    } catch {
      alert('Microphone access denied or unavailable in this environment.');
    }
  };

  const stopMicRecording = () => {
    if (mediaRecorderRef.current && isRecordingMic) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Mic timer
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (isRecordingMic) {
      t = setInterval(() => setMicTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(t);
  }, [isRecordingMic]);

  // If no recording is available or consent was not granted
  if (recording.recordingStatus !== 'Available' && !recording.audioUrl) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400">Audio Telephony Stream</div>
            <div className="text-sm font-bold text-white mt-0.5">{recording.title}</div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Direction:</span>
            <span className="font-semibold text-slate-200">{recording.direction}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Outcome:</span>
            <span className="font-semibold text-slate-200">{recording.outcome}</span>
          </div>
        </div>

        <div className="py-4 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="w-8 h-8 text-amber-400 mb-2 opacity-80" />
          <h4 className="text-sm font-bold text-white mb-1">
            Audio Stream Archived · {recording.recordingStatus}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mb-4">
            Two-party recording consent was not logged in the SIP handshake. You may manually attach an audio recording or capture microphone input below.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold cursor-pointer transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Attach Audio (.mp3, .wav)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {!isRecordingMic ? (
              <button
                type="button"
                onClick={startMicRecording}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-xs font-semibold cursor-pointer transition-colors"
              >
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <span>Record via Mic</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopMicRecording}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold cursor-pointer transition-colors animate-pulse"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Stop Recording ({formatTime(micTime)})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentProgressRatio = currentTime / duration;
  const waveform =
    recording.audioWaveform && recording.audioWaveform.length > 0
      ? recording.audioWaveform
      : Array(60).fill(40);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 text-slate-100 shadow-xl space-y-3">
      {/* HTML5 audio element for actual audio playback */}
      {recording.audioUrl && (
        <audio
          ref={audioRef}
          src={recording.audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Recording Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
            {recording.audioUrl ? (
              <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                ● Real Audio File Attached
              </span>
            ) : (
              <span className="font-mono text-indigo-400 font-semibold flex items-center gap-1 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded">
                ● Telephony Stream (Web Audio Synthesized)
              </span>
            )}
            <span>·</span>
            <span className="text-slate-300 font-medium">24kHz HD Codec</span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Consent Verified
            </span>
          </div>
          <div className="text-sm font-bold text-white mt-1">{recording.title}</div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-medium cursor-pointer transition-colors"
            title="Upload real audio file"
          >
            <Upload className="w-3 h-3 text-indigo-400" />
            <span>Upload Audio</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {!isRecordingMic ? (
            <button
              type="button"
              onClick={startMicRecording}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-medium cursor-pointer transition-colors"
              title="Record voice via microphone"
            >
              <Mic className="w-3 h-3 text-rose-400" />
              <span>Mic Test</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopMicRecording}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-600 text-white rounded text-[11px] font-medium cursor-pointer transition-colors animate-pulse"
            >
              <Square className="w-3 h-3" />
              <span>Stop ({formatTime(micTime)})</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px] border-l border-slate-800 pl-3">
            <span>Rep:</span>
            <span className="font-semibold text-slate-200">{recording.repName}</span>
          </div>
        </div>
      </div>

      {/* Interactive Waveform Display */}
      <div className="py-2">
        <div className="flex items-end gap-1 h-18 w-full overflow-hidden px-1 cursor-pointer group">
          {waveform.map((val, idx) => {
            const barFraction = idx / waveform.length;
            const isPlayed = barFraction <= currentProgressRatio;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleWaveformClick(idx, waveform.length)}
                className="flex-1 flex flex-col justify-end items-center h-full group/bar focus:outline-none cursor-pointer"
                title={`Seek to ${formatTime(barFraction * duration)}`}
              >
                <div
                  style={{ height: `${Math.max(12, val)}%` }}
                  className={`w-full rounded-sm transition-all duration-100 ${
                    isPlayed
                      ? 'bg-indigo-500 shadow-sm shadow-indigo-500/30'
                      : 'bg-slate-700/80 group-hover/bar:bg-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Scrub Bar */}
        <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-400 mt-2 px-1">
          <span>{formatTime(currentTime)}</span>
          <span className="text-slate-600">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Skip Back 10s */}
          <button
            type="button"
            onClick={() => handleSkip(-10)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Rewind 10 seconds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Primary Play / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            title={isPlaying ? 'Pause playback' : 'Play audio'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Skip Forward 10s */}
          <button
            type="button"
            onClick={() => handleSkip(10)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fast forward 10 seconds"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg ml-2">
            {[1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setPlaybackRate(rate)}
                className={`px-2 py-1 text-[11px] font-mono rounded cursor-pointer transition-colors ${
                  playbackRate === rate
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Volume & Audio State */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            title={`Volume: ${Math.round(volume * 100)}%`}
          />

          <span className="text-[11px] font-mono tabular-nums text-slate-400 w-8">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      </div>

      {/* Transcription Disclaimer Banner */}
      <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>
            {recording.audioUrl
              ? 'Real audio source attached. AI transcript displayed is demonstrative for this call session.'
              : 'Web Audio synthetic tone generator active. For real audio, attach an .mp3/.wav file or record via mic.'}
          </span>
        </span>
        <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
          VoIP Codec: G.711 / OPUS
        </span>
      </div>
    </div>
  );
};
