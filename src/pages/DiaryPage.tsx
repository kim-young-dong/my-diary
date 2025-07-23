// src/pages/DiaryPage.tsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const DiaryPage: React.FC = () => {
  // id가 항상 string 타입임을 보장
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      if (!id) return; // id가 없을 경우를 대비한 타입 가드

      try {
        await deleteDoc(doc(db, "diaries", id));
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  return (
    <div>
      {/* 여기에 id를 사용해 Firestore에서 특정 일기를 불러와 표시하는 로직 추가 */}
      <h1>일기 상세 페이지 (ID: {id})</h1>
      <button onClick={handleEdit}>수정하기</button>
      <button onClick={handleDelete}>삭제하기</button>
    </div>
  );
};

export default DiaryPage;
