import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Check
} from 'lucide-react';
import { 
  Board, 
  Message, 
  PostItColor, 
  COLOR_CONFIG, 
  AVAILABLE_EMOJIS 
} from '../types';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';

interface PostItModalProps {
  board: Board;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: Omit<Message, 'id' | 'createdAt' | 'likes'>) => void;
}

const PIN_STYLES: Array<{ id: 'red' | 'blue' | 'yellow' | 'green' | 'tape'; label: string; colorClass: string }> = [
  { id: 'red', label: '빨강 핀', colorClass: 'bg-red-500' },
  { id: 'blue', label: '파랑 핀', colorClass: 'bg-sky-500' },
  { id: 'yellow', label: '노랑 핀', colorClass: 'bg-amber-400' },
  { id: 'green', label: '초록 핀', colorClass: 'bg-emerald-500' },
  { id: 'tape', label: '테이프', colorClass: 'bg-stone-300' },
];

export const PostItModal: React.FC<PostItModalProps> = ({
  board,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<PostItColor>('yellow');
  const [emoji, setEmoji] = useState('💖');
  const [pinStyle, setPinStyle] = useState<'red' | 'blue' | 'yellow' | 'green' | 'tape'>('red');
  const [fontStyle, setFontStyle] = useState<'handwriting' | 'korean'>('handwriting');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !content.trim()) return;

    setIsSubmitting(true);
    soundManager.playChime();

    // Trigger sweet confetti burst from bottom center
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'],
      });
    } catch {
      // ignore
    }

    // Natural slight tilt (-2.5 to +2.5 degrees)
    const randomRotation = Number((Math.random() * 5 - 2.5).toFixed(1));

    onSubmit({
      boardId: board.id,
      sender: sender.trim(),
      content: content.trim(),
      color,
      emoji,
      rotation: randomRotation,
      pinStyle,
      fontStyle,
    });

    // Reset and close
    setTimeout(() => {
      setSender('');
      setContent('');
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  const selectedColorConfig = COLOR_CONFIG[color];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>{board.recipient} 님에게 메시지 남기기</span>
              <span className="text-base">{emoji}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              따뜻한 마음과 추억을 포스트잇에 적어 롤링페이퍼에 붙여주세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Form Controls Column (7 cols on desktop) */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Sender Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                작성자 이름 (닉네임) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={24}
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="예: 3반 귀염둥이 수민, 짝꿍 태현"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-stone-900 placeholder:text-stone-400"
              />
            </div>

            {/* Content Area */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  전하고 싶은 이야기 <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-stone-400">
                  {content.length}/500자
                </span>
              </div>
              <textarea
                required
                rows={4}
                maxLength={500}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="선생님과 함께한 시간 동안 정말 감사했습니다! 항상 행복하시고 어디서든 응원할게요 :)"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-stone-900 placeholder:text-stone-400 resize-none"
              />
            </div>

            {/* Post-it Color Picker */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                포스트잇 배경색
              </label>
              <div className="grid grid-cols-6 gap-2">
                {(Object.keys(COLOR_CONFIG) as PostItColor[]).map((cKey) => {
                  const cfg = COLOR_CONFIG[cKey];
                  const isSelected = color === cKey;
                  return (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => {
                        soundManager.playPop();
                        setColor(cKey);
                      }}
                      className={`h-9 rounded-xl border flex items-center justify-center transition-all ${cfg.bg} ${
                        isSelected ? 'border-stone-800 scale-105 shadow-md ring-2 ring-stone-900/10' : 'border-stone-200/80 hover:scale-102'
                      }`}
                      title={cfg.name}
                    >
                      {isSelected && <Check className="w-4 h-4 text-stone-800 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sticker / Emoji Picker */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                스티커 이모지
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-stone-50 border border-stone-200/70 rounded-xl">
                {AVAILABLE_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setEmoji(em);
                    }}
                    className={`w-8 h-8 text-lg rounded-lg flex items-center justify-center transition-transform hover:scale-120 ${
                      emoji === em ? 'bg-amber-100 ring-2 ring-amber-400 scale-110' : 'hover:bg-white'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Style and Pin Style Row */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  글씨체 스타일
                </label>
                <div className="flex gap-1.5 p-1 bg-stone-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFontStyle('handwriting')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      fontStyle === 'handwriting' 
                        ? 'bg-white text-stone-900 shadow-sm font-bold' 
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    ✏️ 손글씨
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontStyle('korean')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      fontStyle === 'korean' 
                        ? 'bg-white text-stone-900 shadow-sm font-bold' 
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    📖 단정체
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  고정 스타일
                </label>
                <div className="flex items-center gap-1.5 py-1">
                  {PIN_STYLES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPinStyle(p.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        p.id === 'tape' ? 'border border-dashed border-stone-400 bg-stone-200' : p.colorClass
                      } ${pinStyle === p.id ? 'ring-2 ring-offset-2 ring-stone-900 scale-110' : 'opacity-70 hover:opacity-100'}`}
                      title={p.label}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Live Preview Column (5 cols on desktop) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-stone-100/60 rounded-2xl p-4 border border-stone-200/60">
            <span className="text-[11px] font-semibold text-stone-400 mb-3 uppercase tracking-wider">
              미리보기
            </span>

            {/* Pinned Note Preview */}
            <div className="relative w-full max-w-[260px] aspect-square flex flex-col justify-between p-5 rounded-sm border postit-shadow transition-all duration-300"
              style={{
                backgroundColor: selectedColorConfig.bg.replace('bg-[', '').replace(']', ''),
                borderColor: selectedColorConfig.border.replace('border-[', '').replace(']', ''),
              }}
            >
              {/* Pin or Tape on top */}
              {pinStyle === 'tape' ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 washi-tape border border-stone-300/40 rotate-1 rounded-xs" />
              ) : (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 pushpin">
                  <div className={`w-4 h-4 rounded-full shadow-md ${
                    pinStyle === 'red' ? 'bg-red-500' :
                    pinStyle === 'blue' ? 'bg-sky-500' :
                    pinStyle === 'yellow' ? 'bg-amber-400' : 'bg-emerald-500'
                  }`} />
                  <div className="w-0.5 h-1.5 bg-stone-400 mx-auto -mt-0.5 opacity-60" />
                </div>
              )}

              {/* Emoji Sticker Top Right */}
              <div className="absolute top-3 right-3 text-2xl select-none filter drop-shadow-xs">
                {emoji}
              </div>

              {/* Content Preview */}
              <div className="mt-4 flex-1 overflow-hidden">
                <p 
                  className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    fontStyle === 'handwriting' 
                      ? 'font-handwriting text-base font-bold' 
                      : 'font-korean'
                  } ${selectedColorConfig.text}`}
                >
                  {content.trim() || '이곳에 작성하는 메시지가 귀여운 포스트잇으로 롤링페이퍼 보드에 부착됩니다 ✨'}
                </p>
              </div>

              {/* Sender Name Bottom */}
              <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                <span className={`font-semibold ${selectedColorConfig.text}`}>
                  From. {sender.trim() || '작성자 이름'}
                </span>
                <span className="text-[10px] text-stone-400">
                  방금 전
                </span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 mt-3 text-center">
              화면에 핀으로 꽂힌 형태로 즉시 렌더링됩니다
            </p>
          </div>

          {/* Modal Actions */}
          <div className="md:col-span-12 flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !sender.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md transition-all active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? '부착하는 중...' : '롤링페이퍼에 부착하기'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
