import React, { useState, useMemo } from 'react';
import { 
  Board, 
  Message, 
  COLOR_CONFIG, 
  CATEGORY_LABELS,
  PostItColor 
} from '../types';
import { 
  Plus, 
  Search, 
  Tv, 
  QrCode, 
  Link as LinkIcon, 
  Heart, 
  LayoutGrid, 
  Pin, 
  Calendar, 
  Sparkles,
  Filter
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface BoardViewProps {
  board: Board;
  messages: Message[];
  onOpenCreateMessage: () => void;
  onOpenQR: () => void;
  onOpenSlideShow: () => void;
  onCopyLink: () => void;
  onSelectMessage: (msg: Message) => void;
  onLikeMessage: (msgId: string) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  board,
  messages,
  onOpenCreateMessage,
  onOpenQR,
  onOpenSlideShow,
  onCopyLink,
  onSelectMessage,
  onLikeMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'pins' | 'grid'>('pins');

  // Calculate D-day string if available
  const dDayText = useMemo(() => {
    if (!board.dDay) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(board.dDay);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'D-Day 오늘!';
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  }, [board.dDay]);

  // Filter messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchSearch = 
        m.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchColor = selectedColor === 'all' || m.color === selectedColor;
      return matchSearch && matchColor;
    });
  }, [messages, searchTerm, selectedColor]);

  // Background style based on theme
  const getThemeClass = (theme: Board['theme']) => {
    switch (theme) {
      case 'cork':
        return 'bg-cork';
      case 'notebook':
        return 'bg-notebook-grid';
      case 'chalkboard':
        return 'bg-chalkboard text-white';
      case 'pastel-pink':
        return 'bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50';
      case 'pastel-blue':
        return 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50';
      case 'pastel-green':
        return 'bg-gradient-to-br from-emerald-50 via-teal-50 to-lime-50';
      default:
        return 'bg-[#faf8f5]';
    }
  };

  const isDarkCanvas = board.theme === 'chalkboard';

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex flex-col ${getThemeClass(board.theme)} transition-colors duration-500`}>
      
      {/* Top Banner / Hero Information */}
      <div className={`border-b ${isDarkCanvas ? 'border-white/10 bg-black/25 text-white' : 'border-stone-200/80 bg-white/80'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Recipient & Title Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className={`px-2.5 py-0.5 rounded-md ${
                  isDarkCanvas ? 'bg-white/15 text-white' : 'bg-amber-100 text-amber-900'
                }`}>
                  {CATEGORY_LABELS[board.category]?.emoji} {CATEGORY_LABELS[board.category]?.label || '롤링페이퍼'}
                </span>
                {dDayText && (
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-500 text-white font-bold">
                    {dDayText}
                  </span>
                )}
                <span className={isDarkCanvas ? 'text-stone-300' : 'text-stone-500'}>
                  총 {messages.length}개의 메시지
                </span>
              </div>

              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkCanvas ? 'text-white' : 'text-stone-900'}`}>
                To. {board.recipient}
              </h1>

              <p className={`text-sm sm:text-base font-medium ${isDarkCanvas ? 'text-stone-300' : 'text-stone-600'}`}>
                {board.title}
              </p>

              {board.description && (
                <p className={`text-xs ${isDarkCanvas ? 'text-stone-400' : 'text-stone-500'} pt-0.5 max-w-2xl`}>
                  {board.description}
                </p>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2 pt-2 md:pt-0">
              <button
                onClick={onOpenSlideShow}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  isDarkCanvas
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
                }`}
                title="교실 TV 또는 프로젝터 슬라이드쇼 모드"
              >
                <Tv className="w-4 h-4 text-amber-500" />
                <span>TV 슬라이드쇼</span>
              </button>

              <button
                onClick={onOpenQR}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  isDarkCanvas
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
                }`}
                title="QR 코드 열기"
              >
                <QrCode className="w-4 h-4 text-sky-500" />
                <span>QR 공유</span>
              </button>

              <button
                onClick={onCopyLink}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  isDarkCanvas
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
                }`}
                title="롤링페이퍼 링크 복사"
              >
                <LinkIcon className="w-4 h-4 text-emerald-500" />
                <span>링크 복사</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playPop();
                  onOpenCreateMessage();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>메시지 남기기</span>
              </button>
            </div>

          </div>

          {/* Search & Filter Toolbar */}
          <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkCanvas ? 'text-stone-400' : 'text-stone-400'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="작성자 또는 메시지 검색..."
                className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${
                  isDarkCanvas
                    ? 'bg-white/10 border-white/20 text-white placeholder:text-stone-400 focus:bg-white/15'
                    : 'bg-white border-stone-200 text-stone-800 placeholder:text-stone-400'
                }`}
              />
            </div>

            {/* Filters & View Switcher */}
            <div className="flex items-center flex-wrap gap-2">
              
              {/* Color filter buttons */}
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                    selectedColor === 'all' 
                      ? 'bg-white text-stone-900 shadow-2xs' 
                      : isDarkCanvas ? 'text-stone-300' : 'text-stone-600'
                  }`}
                >
                  전체
                </button>
                {(Object.keys(COLOR_CONFIG) as PostItColor[]).map((cKey) => {
                  const cfg = COLOR_CONFIG[cKey];
                  const isSelected = selectedColor === cKey;
                  return (
                    <button
                      key={cKey}
                      onClick={() => setSelectedColor(cKey)}
                      className={`w-5 h-5 rounded-md border transition-transform ${cfg.bg} ${
                        isSelected ? 'ring-2 ring-stone-900 scale-110 shadow-xs' : 'border-black/10 opacity-80 hover:opacity-100'
                      }`}
                      title={cfg.name}
                    />
                  );
                })}
              </div>

              {/* View Switcher: Pins vs Grid */}
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('pins')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'pins' 
                      ? 'bg-white text-stone-900 shadow-2xs font-bold' 
                      : isDarkCanvas ? 'text-stone-300' : 'text-stone-600'
                  }`}
                  title="자유 핀 보드 뷰"
                  aria-label="핀 보드 보기"
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-stone-900 shadow-2xs font-bold' 
                      : isDarkCanvas ? 'text-stone-300' : 'text-stone-600'
                  }`}
                  title="격자 카드 그리드 뷰"
                  aria-label="그리드 보기"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Main Board Canvas */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {filteredMessages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className={`text-lg font-bold ${isDarkCanvas ? 'text-white' : 'text-stone-900'}`}>
              {searchTerm || selectedColor !== 'all' 
                ? '조건에 맞는 메시지가 없습니다' 
                : '아직 작성된 메시지가 없어요!'}
            </h3>
            <p className={`text-xs sm:text-sm mt-1 max-w-sm ${isDarkCanvas ? 'text-stone-300' : 'text-stone-500'}`}>
              {searchTerm || selectedColor !== 'all' 
                ? '검색어나 필터를 재설정해보세요.' 
                : `${board.recipient} 님에게 전하는 첫 번째 따뜻한 마음의 주인공이 되어보세요!`}
            </p>
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenCreateMessage();
              }}
              className="mt-6 flex items-center gap-1.5 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md text-xs sm:text-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>첫 번째 메시지 남기기</span>
            </button>
          </div>
        ) : (
          /* Messages Grid / Pin Board */
          <div 
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 items-start'
            }
          >
            {filteredMessages.map((msg) => {
              const colorCfg = COLOR_CONFIG[msg.color] || COLOR_CONFIG.yellow;
              const rotation = viewMode === 'pins' ? (msg.rotation || 0) : 0;

              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    soundManager.playPop();
                    onSelectMessage(msg);
                  }}
                  className={`group relative rounded-xl p-5 postit-shadow hover:postit-shadow-hover hover:-translate-y-1 hover:scale-[1.02] cursor-pointer transition-all duration-200 border border-black/5 flex flex-col justify-between min-h-[220px]`}
                  style={{
                    backgroundColor: colorCfg.bg.replace('bg-[', '').replace(']', ''),
                    borderColor: colorCfg.border.replace('border-[', '').replace(']', ''),
                    transform: `rotate(${rotation}deg)`,
                  }}
                >
                  {/* Push Pin or Tape at top */}
                  {msg.pinStyle === 'tape' ? (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 washi-tape border border-stone-300/40 rotate-1 rounded-xs" />
                  ) : (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 pushpin">
                      <div className={`w-4 h-4 rounded-full shadow-md ${
                        msg.pinStyle === 'red' ? 'bg-red-500' :
                        msg.pinStyle === 'blue' ? 'bg-sky-500' :
                        msg.pinStyle === 'yellow' ? 'bg-amber-400' : 'bg-emerald-500'
                      }`} />
                      <div className="w-0.5 h-1.5 bg-stone-400 mx-auto -mt-0.5 opacity-60" />
                    </div>
                  )}

                  {/* Top: Emoji Sticker */}
                  <div className="flex justify-end mb-1">
                    <span className="text-2xl select-none filter drop-shadow-xs transition-transform group-hover:scale-120">
                      {msg.emoji}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 my-1">
                    <p 
                      className={`text-sm leading-relaxed line-clamp-5 ${
                        msg.fontStyle === 'korean' 
                          ? 'font-korean' 
                          : 'font-handwriting font-bold text-base'
                      } ${colorCfg.text}`}
                    >
                      {msg.content}
                    </p>
                  </div>

                  {/* Footer: Sender, Likes & Date */}
                  <div className="mt-3 pt-2.5 border-t border-black/10 flex items-center justify-between text-xs">
                    <span className={`font-bold truncate max-w-[120px] ${colorCfg.text}`}>
                      From. {msg.sender}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playHeart();
                        onLikeMessage(msg.id);
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/70 hover:bg-white text-rose-600 text-[11px] font-semibold border border-rose-200/40 shadow-2xs transition-transform active:scale-90"
                      title="좋아요 공감 보내기"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{msg.likes}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Floating Action Button on Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={() => {
            soundManager.playPop();
            onOpenCreateMessage();
          }}
          className="flex items-center gap-2 px-5 py-3.5 bg-amber-600 text-white rounded-full font-bold shadow-xl transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>메시지 남기기</span>
        </button>
      </div>

    </div>
  );
};
