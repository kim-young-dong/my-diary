import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDiary = async () => {
      const docRef = doc(db, "diaries", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const diary = docSnap.data();
        setDate(new Date(diary.date).toISOString().slice(0, 10));
        setContent(diary.content);
      } else {
        alert("존재하지 않는 일기입니다.");
        navigate("/", { replace: true });
      }
      setLoading(false);
    };
    fetchDiary();
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!id || !content.trim() || !date) return;
    if (window.confirm("일기를 수정하시겠습니까?")) {
      try {
        const docRef = doc(db, "diaries", id);
        await updateDoc(docRef, {
          date: new Date(date).getTime(),
          content: content,
        });
        alert("수정이 완료되었습니다.");
        navigate(`/diary/${id}`, { replace: true });
      } catch (e) {
        console.error(e);
        alert("수정에 실패했습니다.");
      }
    }
  };

  if (loading) return <div className="text-center p-10">로딩 중...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">일기 수정</h1>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          날짜
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          내용
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
        >
          취소
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          수정 완료
        </button>
      </div>
    </div>
  );
};

export default EditPage;
