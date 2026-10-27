import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { 
  Board, 
  BoardCategory, 
  BoardTheme, 
  CATEGORY_LABELS 
} from '../types';
import { soundManager } from '../utils/sound';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: (board: Board) => void;
}

const THEME_OPTIONS: Array<{ id: BoardTheme; label: string; previewClass: string }> = [
  { id: 'cork', label: '코르크 보드', previewClass: 'bg-cork border-amber-700/30' },
  { id: 'notebook', label: '모눈종이', previewClass: 'bg-notebook-grid border-stone-300' },
  { id: 'chalkboard', label: '감성 칠판', previewClass: 'bg-chalkboard border-emerald-950' },
  { id: 'pastel-pink', label: '로맨틱 핑크', previewClass: 'bg-rose-100 border-rose-300' },
  { id: 'pastel-blue', label: '스카이 블루', previewClass: 'bg-sky-100 border-sky-300' },
  { id: 'pastel-green', label: '세이지 그린', previewClass: 'bg-emerald-100 border-emerald-300' },
];

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onCreateBoard,
}) => {
  const [recipient, setRecipient] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BoardCategory>('teaching');
  const [theme, setTheme] = useState<BoardTheme>('cork');
  const [description, setDescription] = useState('');
  const [dDay, setDDay] = useState('');

  if (!isOpen) return null;

  // Auto-generate title suggestion when recipient or category changes if title is empty or defaulted
  const handleCategoryChange = (cat: BoardCategory) => {
    setCategory(cat);
    if (!title || title.includes('선생님') || title.includes('생일') || title.includes('졸업') || title.includes('응원')) {
      const rec = recipient || '선생님';
      if (cat === 'teaching') setTitle(`${rec} 한 달 동안 감사했습니다! 🍎`);
      else if (cat === 'birthday') setTitle(`${rec}의 생일을 축하해요! 🎂`);
      else if (cat === 'graduation') setTitle(`${rec} 졸업과 새로운 시작을 축하해 🎓`);
      else if (cat === 'transfer') setTitle(`${rec} 어디서든 항상 응원할게 💌`);
      else if (cat === 'cheer') setTitle(`${rec} 할 수 있어! 힘내자 🍀`);
      else if (cat === 'thanks') setTitle(`${rec} 진심으로 고마워요 💐`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !title.trim()) return;

    soundManager.playChime();
    const newBoardId = `board_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    const newBoard: Board = {
      id: newBoardId,
      recipient: recipient.trim(),
      title: title.trim(),
      category,
      theme,
      description: description.trim() || undefined,
      dDay: dDay || undefined,
      createdAt: new Date().toISOString(),
    };

    onCreateBoard(newBoard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                새 롤링페이퍼 만들기
              </h2>
              <p className="text-xs text-stone-500">
                주인공과 목적에 맞는 롤링페이퍼 방을 개설하세요.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Category selection chips */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              롤링페이퍼 사유 / 카테고리
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(CATEGORY_LABELS) as BoardCategory[]).map((catKey) => {
                const item = CATEGORY_LABELS[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => handleCategoryChange(catKey)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipient & D-day */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                받는 사람 (주인공) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={30}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="예: 김민우 교생선생님, 친구 지민이, 3반 모두"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-stone-900 placeholder:text-stone-400"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                기념일 / D-Day (선택)
              </label>
              <input
                type="date"
                value={dDay}
                onChange={(e) => setDDay(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-stone-800"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              롤링페이퍼 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={60}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 선생님 한 달 동안 감사했습니다! 🍎"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-stone-900 placeholder:text-stone-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              안내 및 인사 문구 (선택)
            </label>
            <textarea
              rows={2}
              maxLength={150}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="친구들에게 링크를 공유했을 때 상단에 표시될 따뜻한 안내말을 적어주세요."
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-stone-900 placeholder:text-stone-400 resize-none"
            />
          </div>

          {/* Background Theme */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              보드 배경 테마
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEME_OPTIONS.map((th) => {
                const isSelected = theme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setTheme(th.id);
                    }}
                    className={`h-14 rounded-xl border flex items-center gap-2.5 px-3 transition-all ${th.previewClass} ${
                      isSelected 
                        ? 'ring-2 ring-stone-900 shadow-md scale-102 font-bold text-stone-900' 
                        : 'opacity-85 hover:opacity-100 hover:scale-101 text-stone-700'
                    }`}
                  >
                    <span className="text-xs font-medium truncate">
                      {th.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!recipient.trim() || !title.trim()}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>롤링페이퍼 만들기</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
