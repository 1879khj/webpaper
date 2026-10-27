import React from 'react';
import { Board } from '../types';
import { 
  Sparkles, 
  Plus, 
  QrCode, 
  Link as LinkIcon, 
  FileSpreadsheet, 
  Volume2, 
  VolumeX, 
  Layers
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface HeaderProps {
  boards: Board[];
  currentBoard: Board;
  onSelectBoard: (boardId: string) => void;
  onOpenCreateBoard: () => void;
  onOpenQR: () => void;
  onOpenSheets: () => void;
  onCopyLink: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  boards,
  currentBoard,
  onSelectBoard,
  onOpenCreateBoard,
  onOpenQR,
  onOpenSheets,
  onCopyLink,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-stone-900 font-display">
              마인드페이퍼
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation & Quick Switcher */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-stone-600">
          {/* Board Selector */}
          <div className="flex items-center gap-2 bg-stone-100/90 hover:bg-stone-100 border border-stone-200 rounded-lg px-3 py-1.5 transition-colors">
            <Layers className="w-4 h-4 text-stone-500 shrink-0" />
            <select
              aria-label="롤링페이퍼 보드 선택"
              value={currentBoard.id}
              onChange={(e) => onSelectBoard(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-medium text-stone-800 focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              {boards.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.recipient} - {b.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
            title="현재 보드 링크 복사"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>링크 복사</span>
          </button>

          <button
            onClick={onOpenQR}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
            title="QR 코드 띄우기"
          >
            <QrCode className="w-3.5 h-3.5 text-stone-700" />
            <span>QR 코드</span>
          </button>

          <button
            onClick={onOpenSheets}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
            title="구글 스프레드시트 연동 설정"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>구글 시트</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
            aria-label="효과음 토글"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>
        </div>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile shortcuts */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={onOpenQR}
              className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              title="QR 코드"
              aria-label="QR 코드 열기"
            >
              <QrCode className="w-5 h-5" />
            </button>
            <button
              onClick={onCopyLink}
              className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              title="링크 복사"
              aria-label="링크 복사"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => {
              soundManager.playPop();
              onOpenCreateBoard();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>새 롤링페이퍼</span>
          </button>
        </div>

      </div>
    </header>
  );
};
