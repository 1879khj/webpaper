import { Board, Message } from '../types';

const STORAGE_KEYS = {
  BOARDS: 'mindpaper_boards_v1',
  MESSAGES: 'mindpaper_messages_v1',
  GAS_URL: 'mindpaper_gas_url_v1',
  SOUND_ENABLED: 'mindpaper_sound_v1',
};

export const INITIAL_BOARDS: Board[] = [
  {
    id: 'board_teach2026',
    title: '김민우 교생선생님 한 달 동안 정말 감사했습니다! 🍎',
    recipient: '김민우 교생선생님',
    category: 'teaching',
    theme: 'cork',
    description: '3학년 2반 친구들이 한 달간 함께한 소중한 추억을 담아 드립니다. 선생님 잊지 못할 거예요!',
    createdAt: '2026-10-20T09:00:00.000Z',
    dDay: '2026-10-31',
  },
  {
    id: 'board_bday_jimin',
    title: '세상에서 가장 다정한 지민이의 18번째 생일 축하해! 🎂',
    recipient: '이지민',
    category: 'birthday',
    theme: 'pastel-pink',
    description: '10월 28일 지민이 생일 기념 롤링페이퍼! 축하 메시지 듬뿍 남겨주세요 💕',
    createdAt: '2026-10-24T14:30:00.000Z',
    dDay: '2026-10-28',
  },
  {
    id: 'board_grad_class',
    title: '3학년 2반 영원히! 졸업과 새로운 시작을 응원해 🎓',
    recipient: '3학년 2반 모두',
    category: 'graduation',
    theme: 'chalkboard',
    description: '웃고 울며 함께 만든 찬란했던 1년의 기록. 각자의 자리에서 눈부시게 빛나자!',
    createdAt: '2026-10-15T11:00:00.000Z',
  },
];

export const INITIAL_MESSAGES: Message[] = [
  // Board: teaching
  {
    id: 'msg_1',
    boardId: 'board_teach2026',
    sender: '반장 하은',
    content: '선생님! 첫날 긴장하셨던 모습이 엊그제 같은데 벌써 마지막 날이라니 너무 아쉬워요 😢 항상 질문마다 눈높이에 맞춰 친절하게 설명해주셔서 정말 든든했습니다. 멋진 선생님이 되실 거라고 믿어 의심치 않아요!',
    color: 'yellow',
    emoji: '🍎',
    createdAt: '2026-10-20T10:15:00.000Z',
    likes: 12,
    rotation: -1.8,
    pinStyle: 'red',
    fontStyle: 'korean',
  },
  {
    id: 'msg_2',
    boardId: 'board_teach2026',
    sender: '체육부장 준우',
    content: '민우 쌤! 점심시간마다 농구 같이 해주셔서 너무 즐거웠습니다 🏀 쌤 3점슛 진짜 멋있었어요. 임용고시 한 번에 딱 붙으실 겁니다! 나중에 꼭 교단에서 다시 만나요!',
    color: 'mint',
    emoji: '🍀',
    createdAt: '2026-10-21T13:40:00.000Z',
    likes: 8,
    rotation: 2.1,
    pinStyle: 'blue',
    fontStyle: 'handwriting',
  },
  {
    id: 'msg_3',
    boardId: 'board_teach2026',
    sender: '맨 앞자리 서연',
    content: '선생님의 수업 자료와 따뜻한 피드백 덕분에 역사 시간이 제일 기다려졌어요. 교단 뒤에서 항상 저희를 아껴주시던 따스한 눈빛 잊지 않을게요. 항상 건강하시고 행복하세요! 💐',
    color: 'pink',
    emoji: '💐',
    createdAt: '2026-10-22T08:20:00.000Z',
    likes: 15,
    rotation: -2.5,
    pinStyle: 'yellow',
    fontStyle: 'handwriting',
  },
  {
    id: 'msg_4',
    boardId: 'board_teach2026',
    sender: '도서부 수민',
    content: '교생선생님 연구실에 계실 때마다 간식 챙겨주시고 진로 고민도 진지하게 들어주셔서 큰 위로가 되었어요. 어디를 가시든 학생들에게 최고의 선생님이 되실 거예요 ✨',
    color: 'purple',
    emoji: '🌟',
    createdAt: '2026-10-23T16:05:00.000Z',
    likes: 9,
    rotation: 1.2,
    pinStyle: 'tape',
    fontStyle: 'korean',
  },
  {
    id: 'msg_5',
    boardId: 'board_teach2026',
    sender: '뒷자리 현우',
    content: '쌤 수업 진짜 귀에 쏙쏙 들어왔어요! 3학년 2반 잊지 마시고 꼭 맛있는 거 사들고 놀러오셔야 합니다 약속~! 🤙',
    color: 'orange',
    emoji: '🎉',
    createdAt: '2026-10-24T17:10:00.000Z',
    likes: 6,
    rotation: -0.8,
    pinStyle: 'green',
    fontStyle: 'handwriting',
  },
  {
    id: 'msg_6',
    boardId: 'board_teach2026',
    sender: '2반 귀요미 예은',
    content: '선생님! 보고 싶을 거예요 ㅠㅠ 저희 반 와주셔서 정말 행운이었어요. 선생님은 이미 최고입니다! ❤️❤️❤️',
    color: 'yellow',
    emoji: '💖',
    createdAt: '2026-10-25T11:30:00.000Z',
    likes: 11,
    rotation: 2.4,
    pinStyle: 'red',
    fontStyle: 'handwriting',
  },

  // Board: birthday
  {
    id: 'msg_b1',
    boardId: 'board_bday_jimin',
    sender: '소울메이트 유진',
    content: '지민아 열여덟 번째 생일 진짜 축하해 🎂🎉 올해 입시 준비하느라 고생 많은데 너는 분명 잘 해낼 거야. 이번 주말에 마라탕이랑 탕후루 내가 쏜다! 늘 내 곁에 있어줘서 고마워 사랑해!',
    color: 'pink',
    emoji: '🎂',
    createdAt: '2026-10-24T15:00:00.000Z',
    likes: 14,
    rotation: 1.5,
    pinStyle: 'red',
    fontStyle: 'handwriting',
  },
  {
    id: 'msg_b2',
    boardId: 'board_bday_jimin',
    sender: '짝꿍 태현',
    content: '지민아 생일 축하! 매일 아침마다 잠 깨워주고 숙제 알려줘서 고맙다 ㅋㅋ 오늘 하루 세상에서 제일 맛있는 거 많이 먹고 행복해라!',
    color: 'blue',
    emoji: '🎁',
    createdAt: '2026-10-24T16:20:00.000Z',
    likes: 7,
    rotation: -2.1,
    pinStyle: 'blue',
    fontStyle: 'korean',
  },
  {
    id: 'msg_b3',
    boardId: 'board_bday_jimin',
    sender: '동아리 선배 민재',
    content: '우리 밴드부 최고의 건반 지민이 생축! 항상 묵묵히 연습 열심히 해줘서 고맙다. 이번 가을 축제 무대도 찢어보자 🔥',
    color: 'mint',
    emoji: '✨',
    createdAt: '2026-10-25T10:00:00.000Z',
    likes: 10,
    rotation: -1.0,
    pinStyle: 'tape',
    fontStyle: 'handwriting',
  },

  // Board: graduation
  {
    id: 'msg_g1',
    boardId: 'board_grad_class',
    sender: '담임선생님 박철수',
    content: '사랑하는 3학년 2반 아이들아, 너희들과 함께 웃고 뛰놀던 봄 여름 가을 겨울이 주마등처럼 스쳐지나가는구나. 어떤 거친 세상이 너희를 기다려도 너희 안의 빛을 잃지 말아라. 언제나 너희 편이다.',
    color: 'yellow',
    emoji: '💐',
    createdAt: '2026-10-15T12:00:00.000Z',
    likes: 38,
    rotation: 0,
    pinStyle: 'red',
    fontStyle: 'korean',
  },
  {
    id: 'msg_g2',
    boardId: 'board_grad_class',
    sender: '부반장 지호',
    content: '체육대회 종합우승했던 날이랑 축제 부스 했던 날 평생 못 잊을 것 같아. 2반이라서 너무 행복했다 다들 성공해서 동창회에서 만나자!',
    color: 'mint',
    emoji: '🎓',
    createdAt: '2026-10-16T14:10:00.000Z',
    likes: 19,
    rotation: 2.0,
    pinStyle: 'yellow',
    fontStyle: 'handwriting',
  },
];

export function getStoredBoards(): Board[] {
  if (typeof window === 'undefined') return INITIAL_BOARDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOARDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(INITIAL_BOARDS));
      return INITIAL_BOARDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOARDS;
  }
}

export function saveStoredBoards(boards: Board[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
  } catch (e) {
    console.error('Failed to save boards to localStorage', e);
  }
}

export function getStoredMessages(): Message[] {
  if (typeof window === 'undefined') return INITIAL_MESSAGES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MESSAGES;
  }
}

export function saveStoredMessages(messages: Message[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save messages to localStorage', e);
  }
}

export function getStoredGasUrl(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEYS.GAS_URL) || '';
}

export function saveStoredGasUrl(url: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.GAS_URL, url.trim());
}
