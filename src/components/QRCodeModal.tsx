import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Tv, 
  ExternalLink, 
  Share2 
} from 'lucide-react';
import { Board } from '../types';
import { soundManager } from '../utils/sound';

interface QRCodeModalProps {
  board: Board;
  isOpen: boolean;
  onClose: () => void;
  onCopyLink: () => void;
  copied: boolean;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  board,
  isOpen,
  onClose,
  onCopyLink,
  copied,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isTvMode, setIsTvMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate current board URL
  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?board=${encodeURIComponent(board.id)}`
    : '';

  useEffect(() => {
    if (!isOpen || !currentUrl) return;

    QRCode.toDataURL(currentUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    soundManager.playPop();
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `mindpaper_qr_${board.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className={`relative w-full bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transition-all duration-300 ${
          isTvMode ? 'max-w-4xl p-8 sm:p-12 text-center' : 'max-w-md p-6'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {isTvMode ? (
          /* ================= TV / Classroom Projector Big Screen Mode ================= */
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-900 rounded-full text-sm font-semibold">
              <Tv className="w-4 h-4 text-amber-600" />
              <span>교실 TV / 빔프로젝터 대화면 공유 모드</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                To. {board.recipient} 롤링페이퍼
              </h1>
              <p className="text-base sm:text-lg text-stone-600 mt-2">
                스마트폰 기본 카메라로 아래 QR 코드를 비추면 즉시 메시지를 작성할 수 있습니다!
              </p>
            </div>

            {/* Huge QR Code */}
            <div className="p-6 bg-white rounded-3xl shadow-xl border-4 border-amber-400 inline-block">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="롤링페이퍼 QR코드"
                  className="w-72 h-72 sm:w-88 sm:h-88 object-contain"
                />
              ) : (
                <div className="w-72 h-72 flex items-center justify-center text-stone-400 text-sm">
                  QR 코드 생성 중...
                </div>
              )}
            </div>

            <div className="text-sm font-mono text-stone-500 bg-stone-100 px-4 py-2 rounded-xl max-w-lg truncate">
              {currentUrl}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onCopyLink}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl text-sm transition-all shadow-sm active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '링크가 복사되었습니다!' : '링크 복사하기'}</span>
              </button>
              <button
                onClick={() => setIsTvMode(false)}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl text-sm transition-colors"
              >
                기본 모드로 돌아가기
              </button>
            </div>
          </div>
        ) : (
          /* ================= Standard Share & QR Modal ================= */
          <div className="flex flex-col items-center text-center space-y-4">
            
            {/* Header */}
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
                <Share2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-stone-900">
                롤링페이퍼 공유 & QR코드
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                링크나 QR코드를 공유하여 친구들의 따뜻한 마음을 모아보세요.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 shadow-inner">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="롤링페이퍼 QR코드"
                  className="w-52 h-52 sm:w-56 sm:h-56 rounded-lg object-contain bg-white p-2 shadow-xs"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-stone-400 text-xs">
                  QR 코드 생성 중...
                </div>
              )}
            </div>

            {/* Recipient & Instructions */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl px-4 py-2 w-full text-left">
              <div className="text-xs font-bold text-amber-900">
                To. {board.recipient}
              </div>
              <p className="text-[11px] text-amber-700 mt-0.5">
                스마트폰 카메라로 QR을 스캔하면 로그인 없이 바로 작성할 수 있습니다.
              </p>
            </div>

            {/* URL Display with Copy Button */}
            <div className="w-full flex items-center gap-1.5 p-1.5 bg-stone-100 rounded-xl border border-stone-200">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-transparent px-2 text-xs text-stone-600 focus:outline-none truncate select-all"
              />
              <button
                onClick={onCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300/80 shadow-2xs transition-all active:scale-95 shrink-0"
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
            </div>

            {/* Action Buttons: TV Mode & Download QR */}
            <div className="grid grid-cols-2 gap-2 w-full pt-1">
              <button
                onClick={() => {
                  soundManager.playPop();
                  setIsTvMode(true);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors"
                title="교실 TV 또는 프로젝터에 띄우기"
              >
                <Tv className="w-4 h-4 text-amber-700" />
                <span>교실 TV 대화면</span>
              </button>

              <button
                onClick={handleDownloadQr}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                title="QR 코드 이미지 다운로드"
              >
                <Download className="w-4 h-4" />
                <span>QR 이미지 저장</span>
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
