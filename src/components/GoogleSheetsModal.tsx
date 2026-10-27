import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { GAS_SCRIPT_CODE, fetchAllFromGAS, syncBoardToGAS, syncMessageToGAS } from '../utils/gasHelper';
import { Board, Message } from '../types';
import { soundManager } from '../utils/sound';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasUrl: string;
  onSaveGasUrl: (url: string) => void;
  boards: Board[];
  messages: Message[];
  onImportData: (data: { boards?: Board[]; messages?: Message[] }) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  gasUrl,
  onSaveGasUrl,
  boards,
  messages,
  onImportData,
}) => {
  const [inputUrl, setInputUrl] = useState(gasUrl);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GAS_SCRIPT_CODE);
      setCopiedCode(true);
      soundManager.playPop();
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleSaveUrl = () => {
    onSaveGasUrl(inputUrl.trim());
    soundManager.playChime();
    setStatusMsg({
      type: 'success',
      text: inputUrl.trim() 
        ? 'Google Apps Script 웹 앱 URL이 저장되었습니다.' 
        : '로컬 모드로 전환되었습니다.',
    });
  };

  const handleFetchFromSheets = async () => {
    if (!inputUrl.trim()) {
      setStatusMsg({ type: 'error', text: '먼저 구글 웹 앱 URL을 입력해주세요.' });
      return;
    }
    setIsLoading(true);
    setStatusMsg({ type: 'info', text: '구글 스프레드시트에서 데이터를 가져오는 중...' });

    const result = await fetchAllFromGAS(inputUrl.trim());
    setIsLoading(false);

    if (result && (result.boards || result.messages)) {
      onImportData(result);
      soundManager.playChime();
      setStatusMsg({
        type: 'success',
        text: `성공! 보드 ${(result.boards || []).length}개와 메시지 ${(result.messages || []).length}개를 가져왔습니다.`,
      });
    } else {
      setStatusMsg({
        type: 'error',
        text: '스프레드시트에서 응답을 받지 못했습니다. URL과 배포 권한(모든 사용자)을 확인해주세요.',
      });
    }
  };

  const handleBackupToSheets = async () => {
    if (!inputUrl.trim()) {
      setStatusMsg({ type: 'error', text: '먼저 구글 웹 앱 URL을 입력해주세요.' });
      return;
    }
    setIsLoading(true);
    setStatusMsg({ type: 'info', text: '현재 데이터를 구글 스프레드시트로 전송하는 중...' });

    try {
      for (const b of boards) {
        await syncBoardToGAS(inputUrl.trim(), b);
      }
      for (const m of messages) {
        await syncMessageToGAS(inputUrl.trim(), m);
      }
      soundManager.playChime();
      setStatusMsg({
        type: 'success',
        text: '스프레드시트에 현재 모든 보드 및 메시지 전송 요청이 완료되었습니다!',
      });
    } catch {
      setStatusMsg({
        type: 'error',
        text: '전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                구글 스프레드시트 (GAS) 연동 설정
              </h2>
              <p className="text-xs text-stone-500">
                Google Sheets를 영구 데이터베이스로 활용하여 메시지를 안전하게 보관하세요.
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

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Status Message */}
          {statusMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              statusMsg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : statusMsg.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Setup Guide Accordion */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wide">
              <span>연동 3단계 가이드</span>
            </h3>
            
            <ol className="text-xs text-stone-600 space-y-2 list-decimal list-inside pl-1 leading-relaxed">
              <li>
                새 <strong className="text-stone-800">Google 스프레드시트</strong>를 생성합니다.
              </li>
              <li>
                상단 메뉴의 <strong className="text-stone-800">[확장 프로그램] → [Apps Script]</strong>를 클릭하고 아래 스크립트 코드를 붙여넣습니다.
              </li>
              <li>
                우측 상단 <strong className="text-stone-800">[배포] → [새 배포]</strong> 선택 후 유형: <strong className="text-emerald-700">웹 앱</strong>, 액세스 권한: <strong className="text-emerald-700">모든 사용자(Anyone)</strong>로 배포한 뒤 웹 앱 URL을 복사하여 아래에 입력합니다.
              </li>
            </ol>

            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 shadow-2xs transition-all active:scale-95"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Apps Script 코드 복사됨!' : 'Apps Script 코드 복사하기'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 py-1.5 px-2"
              >
                <span>{showCode ? '코드 접기' : '코드 미리보기'}</span>
                {showCode ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Code Snippet Box */}
            {showCode && (
              <div className="mt-3 p-3 bg-stone-900 text-stone-200 text-[11px] font-mono rounded-xl max-h-52 overflow-y-auto border border-stone-800">
                <pre className="whitespace-pre">{GAS_SCRIPT_CODE}</pre>
              </div>
            )}
          </div>

          {/* Database Schema Reference (PRD Compliance Display) */}
          <div className="border border-stone-200/80 rounded-2xl p-4 bg-white space-y-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              자동 생성되는 시트 구조 (PRD 사양)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-semibold text-stone-800 mb-1">📋 Boards 시트</div>
                <div className="font-mono text-[10px] text-stone-500">
                  BoardID | Title | Recipient | Category | CreatedAt
                </div>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-semibold text-stone-800 mb-1">💬 Messages 시트</div>
                <div className="font-mono text-[10px] text-stone-500">
                  BoardID | Sender | Content | Color | Emoji | CreatedAt
                </div>
              </div>
            </div>
          </div>

          {/* URL Input & Save */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              배포된 Google Apps Script 웹 앱 URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono transition-all"
              />
              <button
                type="button"
                onClick={handleSaveUrl}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                저장
              </button>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              * URL을 비워두시면 브라우저 로컬 저장소 모드로 작동합니다.
            </p>
          </div>

          {/* Sync Actions */}
          {inputUrl.trim() && (
            <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleFetchFromSheets}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>시트에서 가져오기</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleBackupToSheets}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>현재 데이터 시트로 백업</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
