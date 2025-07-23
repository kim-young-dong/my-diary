// src/pages/HomePage.tsx

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { DiaryEntry } from "../types/data"; // 타입 정의 import
import DiaryList from "../components/DiaryList"; // DiaryList 컴포넌트도 props 타입을 지정해야 합니다.

const HomePage: React.FC = () => {
  const [diaryList, setDiaryList] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const q = query(
          collection(db, "diaries"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        const diaries = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            content: data.content,
            date: data.date,
            // Firestore Timestamp를 JavaScript Date 객체로 변환
            createdAt: (data.createdAt as Timestamp).toDate(),
          };
        });

        setDiaryList(diaries);
      } catch (error) {
        console.error("Error fetching diaries: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  // DiaryList 컴포넌트에 diaryList를 prop으로 전달
  return (
    <div>
      <h1>나의 일기장</h1>
      <DiaryList diaryList={diaryList} />
    </div>
  );
};

export default HomePage;
