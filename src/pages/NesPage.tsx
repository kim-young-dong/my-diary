// src/pages/NewPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

const NewPage: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!content.trim() || !date) {
      alert("날짜와 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const newDiaryData = {
        date: new Date(date).getTime(),
        content: content,
        createdAt: Timestamp.now(), // Firestore의 Timestamp 사용을 권장
      };

      await addDoc(collection(db, "diaries"), newDiaryData);

      navigate("/", { replace: true });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <h1>새 일기 쓰기</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSubmit}>저장하기</button>
    </div>
  );
};

export default NewPage;
