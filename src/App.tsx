import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Board, 
  Message 
} from './types';
import { 
  getStoredBoards, 
  saveStoredBoards, 
  getStoredMessages, 
  saveStoredMessages, 
  getStoredGasUrl, 
  saveStoredGasUrl 
} from './utils/storage';
import { syncBoardToGAS, syncMessageToGAS } from './utils/gasHelper';
import { soundManager } from './utils/sound';

import { Header } from './components/Header';
import { BoardView } from './components/BoardView';
import { PostItModal } from './components/PostItModal';
import { PostItDetailModal } from './components/PostItDetailModal';
import { CreateBoardModal } from './components/CreateBoardModal';
import { QRCodeModal } from './components/QRCodeModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { SlideShowModal } from './components/SlideShowModal';

export default function App() {
  const [boards, setBoards] = useState<Board[]>(getStoredBoards);
  const [messages, setMessages] = useState<Message[]>(getStoredMessages);
  const [gasUrl, setGasUrl] = useState<string>(getStoredGasUrl);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active board ID
  const [activeBoardId, setActiveBoardId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlBoardId = params.get('board');
      if (urlBoardId) return urlBoardId;
    }
    const initial = getStoredBoards();
    return initial[0]?.id || 'board_teach2026';
  });

  // Modals state
  const [isPostItOpen, setIsPostItOpen] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);
  const [isSlideShowOpen, setIsSlideShowOpen] = useState(false);
  const [selectedDetailMessage, setSelectedDetailMessage] = useState<Message | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Show quick toast notification
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Sync active board with URL query param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('board') !== activeBoardId) {
        url.searchParams.set('board', activeBoardId);
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [activeBoardId]);

  // Handle URL change if user hits back/forward
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const bId = params.get('board');
      if (bId && boards.some((b) => b.id === bId)) {
        setActiveBoardId(bId);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [boards]);

  // Current active board object
  const currentBoard = useMemo(() => {
    return boards.find((b) => b.id === activeBoardId) || boards[0] || {
      id: 'default_board',
      title: '우리들의 롤링페이퍼',
      recipient: '선생님',
      category: 'teaching',
      theme: 'cork',
      createdAt: new Date().toISOString(),
    };
  }, [boards, activeBoardId]);

  // Messages for current active board
  const boardMessages = useMemo(() => {
    return messages.filter((m) => m.boardId === currentBoard.id);
  }, [messages, currentBoard.id]);

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    if (next) soundManager.playPop();
  };

  // Switch board
  const handleSelectBoard = (boardId: string) => {
    soundManager.playPop();
    setActiveBoardId(boardId);
  };

  // Create new board
  const handleCreateBoard = async (newBoard: Board) => {
    const updatedBoards = [newBoard, ...boards];
    setBoards(updatedBoards);
    saveStoredBoards(updatedBoards);
    setActiveBoardId(newBoard.id);
    showToast(`'${newBoard.recipient}' 롤링페이퍼가 생성되었습니다! ✨`);

    // Background sync to GAS if configured
    if (gasUrl) {
      syncBoardToGAS(gasUrl, newBoard).catch(console.error);
    }
  };

  // Add new post-it message
  const handleAddMessage = async (msgData: Omit<Message, 'id' | 'createdAt' | 'likes'>) => {
    const newMessage: Message = {
      ...msgData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);
    saveStoredMessages(updatedMessages);
    showToast('포스트잇이 보드에 부착되었습니다! 💌');

    // Background sync to Google Sheets if GAS URL exists
    if (gasUrl) {
      syncMessageToGAS(gasUrl, newMessage).catch(console.error);
    }
  };

  // Like a message
  const handleLikeMessage = (messageId: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) => {
        if (m.id === messageId) {
          return { ...m, likes: m.likes + 1 };
        }
        return m;
      });
      saveStoredMessages(updated);
      return updated;
    });

    if (selectedDetailMessage && selectedDetailMessage.id === messageId) {
      setSelectedDetailMessage((prev) => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== messageId);
      saveStoredMessages(updated);
      return updated;
    });
    showToast('포스트잇이 삭제되었습니다.');
  };

  // Copy share URL
  const handleCopyLink = async () => {
    const currentUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?board=${encodeURIComponent(currentBoard.id)}`
      : '';

    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      soundManager.playPop();
      showToast('롤링페이퍼 링크가 복사되었습니다! 🔗');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('링크 복사에 실패했습니다.');
    }
  };

  // Save GAS URL
  const handleSaveGasUrl = (url: string) => {
    setGasUrl(url);
    saveStoredGasUrl(url);
  };

  // Import data from GAS
  const handleImportData = (data: { boards?: Board[]; messages?: Message[] }) => {
    if (data.boards && data.boards.length > 0) {
      // Merge with existing
      const existingIds = new Set(boards.map((b) => b.id));
      const newItems = data.boards.filter((b) => !existingIds.has(b.id));
      const mergedBoards = [...boards, ...newItems];
      setBoards(mergedBoards);
      saveStoredBoards(mergedBoards);
    }

    if (data.messages && data.messages.length > 0) {
      const existingMsgIds = new Set(messages.map((m) => m.id));
      const newMsgs = data.messages.filter((m) => !existingMsgIds.has(m.id));
      const mergedMsgs = [...messages, ...newMsgs];
      setMessages(mergedMsgs);
      saveStoredMessages(mergedMsgs);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-800 font-sans">
      
      {/* Top Header */}
      <Header
        boards={boards}
        currentBoard={currentBoard}
        onSelectBoard={handleSelectBoard}
        onOpenCreateBoard={() => setIsCreateBoardOpen(true)}
        onOpenQR={() => setIsQROpen(true)}
        onOpenSheets={() => setIsSheetsOpen(true)}
        onCopyLink={handleCopyLink}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Board View */}
      <main className="flex-1">
        <BoardView
          board={currentBoard}
          messages={boardMessages}
          onOpenCreateMessage={() => setIsPostItOpen(true)}
          onOpenQR={() => setIsQROpen(true)}
          onOpenSlideShow={() => setIsSlideShowOpen(true)}
          onCopyLink={handleCopyLink}
          onSelectMessage={(msg) => setSelectedDetailMessage(msg)}
          onLikeMessage={handleLikeMessage}
        />
      </main>

      {/* Modals */}
      <PostItModal
        board={currentBoard}
        isOpen={isPostItOpen}
        onClose={() => setIsPostItOpen(false)}
        onSubmit={handleAddMessage}
      />

      <PostItDetailModal
        message={selectedDetailMessage}
        allMessages={boardMessages}
        onClose={() => setSelectedDetailMessage(null)}
        onLike={handleLikeMessage}
        onDelete={handleDeleteMessage}
        onSelectMessage={(msg) => setSelectedDetailMessage(msg)}
      />

      <CreateBoardModal
        isOpen={isCreateBoardOpen}
        onClose={() => setIsCreateBoardOpen(false)}
        onCreateBoard={handleCreateBoard}
      />

      <QRCodeModal
        board={currentBoard}
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        onCopyLink={handleCopyLink}
        copied={copied}
      />

      <GoogleSheetsModal
        isOpen={isSheetsOpen}
        onClose={() => setIsSheetsOpen(false)}
        gasUrl={gasUrl}
        onSaveGasUrl={handleSaveGasUrl}
        boards={boards}
        messages={messages}
        onImportData={handleImportData}
      />

      <SlideShowModal
        board={currentBoard}
        messages={boardMessages}
        isOpen={isSlideShowOpen}
        onClose={() => setIsSlideShowOpen(false)}
        onLike={handleLikeMessage}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-stone-900/90 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xl backdrop-blur-sm animate-bounce">
          {toast}
        </div>
      )}

    </div>
  );
}
