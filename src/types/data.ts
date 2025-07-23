// src/types/data.ts

export interface DiaryEntry {
  id: string; // Firestore의 문서 ID
  date: number; // 타임스탬프
  content: string;
  createdAt: Date;
  // 필요하다면 감정 점수 같은 다른 필드를 추가할 수 있습니다.
  // emotion?: number;
}
