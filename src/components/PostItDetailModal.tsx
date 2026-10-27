import React from 'react';
import { 
  X, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Trash2 
} from 'lucide-react';
import { Message, COLOR_CONFIG } from '../types';
import { soundManager } from '../utils/sound';

interface PostItDetailModalProps {
  message: Message | null;
  allMessages: Message[];
  onClose: () => void;
  onLike: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onSelectMessage: (msg: Message) => void;
}

export const PostItDetailModal: React.FC<PostItDetailModalProps> = ({
  message,
  allMessages,
  onClose,
  onLike,
  onDelete,
  onSelectMessage,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!message) return null;

  const currentIndex = allMessages.findIndex((m) => m.id === message.id);
  const prevMsg = currentIndex > 0 ? allMessages[currentIndex - 1] : null;
  const nextMsg = currentIndex < allMessages.length - 1 ? allMessages[currentIndex + 1] : null;

  const colorConfig = COLOR_CONFIG[message.color] || COLOR_CONFIG.yellow;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(
        `[${message.sender}님의 메시지]\n"${message.content}"`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const formattedDate = new Date(message.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrows for desktop */}
        {prevMsg && (
          <button
            onClick={() => {
              soundManager.playPop();
              onSelectMessage(prevMsg);
            }}
            className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 items-center justify-center shadow-lg transition-all"
            title="이전 메시지"
            aria-label="이전 메시지"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {nextMsg && (
          <button
            onClick={() => {
              soundManager.playPop();
              onSelectMessage(nextMsg);
            }}
            className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 items-center justify-center shadow-lg transition-all"
            title="다음 메시지"
            aria-label="다음 메시지"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Enlarged Post-It Card */}
        <div 
          className="relative rounded-2xl p-6 sm:p-8 postit-shadow-hover border border-black/10 overflow-hidden"
          style={{
            backgroundColor: colorConfig.bg.replace('bg-[', '').replace(']', ''),
          }}
        >
          {/* Top pin or tape */}
          {message.pinStyle === 'tape' ? (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 washi-tape border border-stone-300/50 -rotate-1" />
          ) : (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 pushpin">
              <div className={`w-5 h-5 rounded-full shadow-md ${
                message.pinStyle === 'red' ? 'bg-red-500' :
                message.pinStyle === 'blue' ? 'bg-sky-500' :
                message.pinStyle === 'yellow' ? 'bg-amber-400' : 'bg-emerald-500'
              }`} />
              <div className="w-0.5 h-2 bg-stone-400 mx-auto -mt-0.5 opacity-60" />
            </div>
          )}

          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-black/5 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Sticker Emoji */}
          <div className="text-4xl mb-3 select-none filter drop-shadow-xs">
            {message.emoji}
          </div>

          {/* Message Content */}
          <div className="min-h-[140px] max-h-[380px] overflow-y-auto pr-1">
            <p 
              className={`text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words ${
                message.fontStyle === 'korean' ? 'font-korean' : 'font-handwriting text-xl sm:text-2xl font-bold'
              } ${colorConfig.text}`}
            >
              {message.content}
            </p>
          </div>

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className={`font-bold text-sm sm:text-base ${colorConfig.text}`}>
                From. {message.sender}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                {formattedDate}
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-2">
              {/* Copy button */}
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/70 hover:bg-white text-stone-700 text-xs font-medium border border-stone-200/50 shadow-xs transition-colors"
                title="메시지 복사"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>복사</span>
                  </>
                )}
              </button>

              {/* Heart like button */}
              <button
                onClick={() => {
                  soundManager.playHeart();
                  onLike(message.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-rose-600 text-xs font-semibold border border-rose-200/50 shadow-xs transition-all active:scale-95"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>{message.likes}</span>
              </button>

              {/* Delete button (optional) */}
              {onDelete && (
                <button
                  onClick={() => {
                    if (window.confirm('이 포스트잇을 삭제하시겠습니까?')) {
                      onDelete(message.id);
                      onClose();
                    }
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="포스트잇 삭제"
                  aria-label="포스트잇 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Next / Prev Buttons */}
          <div className="flex md:hidden items-center justify-between mt-4 pt-3 border-t border-black/5 text-xs font-medium">
            <button
              disabled={!prevMsg}
              onClick={() => prevMsg && onSelectMessage(prevMsg)}
              className="flex items-center gap-1 text-stone-600 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>이전 메모</span>
            </button>
            <span className="text-[11px] text-stone-400">
              {currentIndex + 1} / {allMessages.length}
            </span>
            <button
              disabled={!nextMsg}
              onClick={() => nextMsg && onSelectMessage(nextMsg)}
              className="flex items-center gap-1 text-stone-600 disabled:opacity-30"
            >
              <span>다음 메모</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
