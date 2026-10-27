export type BoardCategory = 
  | 'teaching'     // 교생실습 / 선생님 감사
  | 'birthday'     // 생일 축하
  | 'graduation'   // 졸업 / 수료
  | 'transfer'     // 전학 / 이사 / 작별
  | 'cheer'        // 시험 / 대회 응원
  | 'thanks'       // 감사 / 기념일
  | 'custom';      // 기타 / 자유 주제

export type BoardTheme = 
  | 'cork'         // 클래식 코르크보드
  | 'notebook'     // 포근한 모눈종이
  | 'chalkboard'   // 아늑한 칠판
  | 'pastel-pink'  // 사랑스러운 핑크
  | 'pastel-blue'  // 산뜻한 스카이블루
  | 'pastel-green';// 싱그러운 세이지그린

export type PostItColor = 
  | 'yellow' 
  | 'pink' 
  | 'mint' 
  | 'blue' 
  | 'purple' 
  | 'orange';

export interface Board {
  id: string;
  title: string;
  recipient: string;
  category: BoardCategory;
  theme: BoardTheme;
  description?: string;
  createdAt: string;
  dDay?: string;
}

export interface Message {
  id: string;
  boardId: string;
  sender: string;
  content: string;
  color: PostItColor;
  emoji: string;
  createdAt: string;
  likes: number;
  rotation?: number;
  pinStyle?: 'red' | 'blue' | 'yellow' | 'green' | 'tape';
  fontStyle?: 'handwriting' | 'korean';
}

export const CATEGORY_LABELS: Record<BoardCategory, { label: string; emoji: string }> = {
  teaching: { label: '교생실습 / 선생님', emoji: '🍎' },
  birthday: { label: '생일 축하', emoji: '🎂' },
  graduation: { label: '졸업 / 수료', emoji: '🎓' },
  transfer: { label: '전학 / 작별', emoji: '💌' },
  cheer: { label: '시험 / 응원', emoji: '🍀' },
  thanks: { label: '감사 / 기념일', emoji: '💐' },
  custom: { label: '자유 주제', emoji: '✨' },
};

export const COLOR_CONFIG: Record<PostItColor, {
  name: string;
  bg: string;
  border: string;
  text: string;
  accent: string;
  shadow: string;
}> = {
  yellow: {
    name: '햇살 옐로우',
    bg: 'bg-[#fff9c4]',
    border: 'border-[#fef08a]',
    text: 'text-amber-950',
    accent: '#facc15',
    shadow: 'rgba(234, 179, 8, 0.2)',
  },
  pink: {
    name: '딸기 핑크',
    bg: 'bg-[#fce7f3]',
    border: 'border-[#fbcfe8]',
    text: 'text-pink-950',
    accent: '#f472b6',
    shadow: 'rgba(244, 114, 182, 0.2)',
  },
  mint: {
    name: '싱그러운 민트',
    bg: 'bg-[#dcfce7]',
    border: 'border-[#bbf7d0]',
    text: 'text-emerald-950',
    accent: '#4ade80',
    shadow: 'rgba(74, 222, 128, 0.2)',
  },
  blue: {
    name: '하늘 블루',
    bg: 'bg-[#e0f2fe]',
    border: 'border-[#bae6fd]',
    text: 'text-sky-950',
    accent: '#38bdf8',
    shadow: 'rgba(56, 189, 248, 0.2)',
  },
  purple: {
    name: '라벤더 퍼플',
    bg: 'bg-[#f3e8ff]',
    border: 'border-[#e9d5ff]',
    text: 'text-purple-950',
    accent: '#c084fc',
    shadow: 'rgba(192, 132, 252, 0.2)',
  },
  orange: {
    name: '피치 오렌지',
    bg: 'bg-[#ffedd5]',
    border: 'border-[#fed7aa]',
    text: 'text-orange-950',
    accent: '#fb923c',
    shadow: 'rgba(251, 146, 60, 0.2)',
  },
};

export const AVAILABLE_EMOJIS = [
  '🎉', '💖', '🎂', '💌', '💐', '🎓', '🍀', '🍎', 
  '🌟', '🧸', '✨', '🌻', '👏', '🥳', '🙌', '☕'
];
