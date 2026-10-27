import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Heart, 
  Tv 
} from 'lucide-react';
import { Board, Message, COLOR_CONFIG } from '../types';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';

interface SlideShowModalProps {
  board: Board;
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
  onLike: (messageId: string) => void;
}

export const SlideShowModal: React.FC<SlideShowModalProps> = ({
  board,
  messages,
  isOpen,
  onClose,
  onLike,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      return;
    }
    setCurrentIndex(0);
  }, [isOpen]);

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || !isPlaying || messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % messages.length;
        soundManager.playPop();
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, messages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, messages.length]);

  if (!isOpen || messages.length === 0) return null;

  const currentMsg = messages[currentIndex];
  const colorCfg = COLOR_CONFIG[currentMsg.color] || COLOR_CONFIG.yellow;

  const handleNext = () => {
    soundManager.playPop();
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  const handlePrev = () => {
    soundManager.playPop();
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const triggerConfetti = () => {
    soundManager.playChime();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'],
    });
  };

  const formattedDate = new Date(currentMsg.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-8 bg-stone-950/90 backdrop-blur-xl text-white select-none">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              To. {board.recipient} 롤링페이퍼 슬라이드쇼
            </h2>
            <p className="text-xs text-stone-400">
              전체 화면으로 한 장씩 감상하는 따뜻한 메시지
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Confetti button */}
          <button
            onClick={triggerConfetti}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>꽃가루 축하!</span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Slide Card Area */}
      <div className="flex-1 flex items-center justify-center my-4 relative max-w-4xl mx-auto w-full">
        
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 sm:-left-12 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all backdrop-blur-md"
          aria-label="이전 메시지"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Big Animated Post-It Card */}
        <div 
          key={currentMsg.id}
          className="relative w-full max-w-xl aspect-4/3 sm:aspect-16/10 rounded-3xl p-8 sm:p-12 shadow-2xl border border-black/10 flex flex-col justify-between transition-all duration-300 transform scale-100 hover:scale-[1.01]"
          style={{
            backgroundColor: colorCfg.bg.replace('bg-[', '').replace(']', ''),
          }}
        >
          {/* Top Pin Decoration */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 pushpin">
            <div className={`w-7 h-7 rounded-full shadow-lg ${
              currentMsg.pinStyle === 'blue' ? 'bg-sky-500' :
              currentMsg.pinStyle === 'yellow' ? 'bg-amber-400' :
              currentMsg.pinStyle === 'green' ? 'bg-emerald-500' : 'bg-red-500'
            }`} />
            <div className="w-1 h-3 bg-stone-400 mx-auto -mt-0.5 opacity-60" />
          </div>

          {/* Sticker Emoji */}
          <div className="absolute top-6 right-8 text-5xl sm:text-6xl select-none filter drop-shadow-md">
            {currentMsg.emoji}
          </div>

          {/* Slide Text Content */}
          <div className="flex-1 flex items-center mt-6 overflow-y-auto pr-2">
            <p 
              className={`text-xl sm:text-2xl md:text-3xl leading-relaxed whitespace-pre-wrap break-words ${
                currentMsg.fontStyle === 'korean' 
                  ? 'font-korean' 
                  : 'font-handwriting font-bold text-2xl sm:text-3xl md:text-4xl'
              } ${colorCfg.text}`}
            >
              {currentMsg.content}
            </p>
          </div>

          {/* Bottom Sender & Heart */}
          <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
            <div>
              <span className={`text-base sm:text-xl font-extrabold ${colorCfg.text}`}>
                From. {currentMsg.sender}
              </span>
              <div className="text-xs text-stone-500 mt-0.5">
                {formattedDate}
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playHeart();
                onLike(currentMsg.id);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/80 hover:bg-white text-rose-600 rounded-xl font-bold shadow-sm transition-transform active:scale-95"
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <span>{currentMsg.likes}</span>
            </button>
          </div>

        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 sm:-right-12 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all backdrop-blur-md"
          aria-label="다음 메시지"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

      {/* Bottom Controls */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 text-xs font-semibold text-stone-300 hover:text-white transition-colors"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 text-amber-400" />
              <span>자동 재생 멈춤</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-amber-400" />
              <span>자동 슬라이드쇼 재생</span>
            </>
          )}
        </button>

        <span className="text-xs font-mono text-stone-400">
          {currentIndex + 1} / {messages.length}
        </span>
      </div>

    </div>
  );
};
