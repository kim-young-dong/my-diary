// src/components/DiaryList.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import type { DiaryEntry } from "../types/data"; // 타입 정의 import

interface DiaryListProps {
  diaryList: DiaryEntry[];
}

const DiaryList: React.FC<DiaryListProps> = ({ diaryList }) => {
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/diary/${id}`); // 예: /diary/123 으로 이동
  };

  if (diaryList.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-10">
        작성된 다이어리가 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {diaryList.map((diary) => (
        <div
          key={diary.id}
          onClick={() => handleClick(diary.id)}
          className="p-4 rounded-xl shadow hover:shadow-md cursor-pointer border hover:bg-gray-50 transition"
        >
          <h3 className="text-lg font-semibold">{diary.date}</h3>
          <p className="text-sm text-gray-400 mb-2">
            {new Date(diary.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-700 line-clamp-2">{diary.content}</p>
        </div>
      ))}
    </div>
  );
};

export default DiaryList;
