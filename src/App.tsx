import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// --- 1. Firebase 설정 (src/firebase.ts) ---
// 실제 프로젝트에서는 이 부분을 별도 파일로 분리하세요.
const firebaseConfig = {
  // 여기에 자신의 Firebase 설정 코드를 붙여넣으세요.
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 2. 타입 정의 (src/types/data.ts) ---
// 실제 프로젝트에서는 이 부분을 별도 파일로 분리하세요.
interface DiaryEntry {
  id: string;
  date: number;
  content: string;
  createdAt: Timestamp; // Firestore의 Timestamp 타입 사용
}

// --- Helper Components ---
const Header = () => (
  <header className="py-4 px-8 bg-green-500 text-white text-center shadow-md">
    <Link to="/" className="text-3xl font-bold tracking-tight">
      나의 비밀 일기장
    </Link>
  </header>
);

const Footer = () => (
  <footer className="text-center py-4 mt-8 text-gray-500 text-sm">
    Copyright © {new Date().getFullYear()} My Diary App. All rights reserved.
  </footer>
);

// --- 3. 페이지 컴포넌트 (src/pages/*.tsx) ---

// HomePage: 일기 목록 조회
const HomePage = () => {
  const [diaryList, setDiaryList] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const q = query(collection(db, "diaries"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);

        const diaries = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as DiaryEntry)
        );

        setDiaryList(diaries);
      } catch (error) {
        console.error("Error fetching diaries: ", error);
        alert("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  if (loading) {
    return <div className="text-center p-10">로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/new")}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          새 일기 쓰기
        </button>
      </div>
      {diaryList.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
          작성된 일기가 없습니다. 첫 일기를 작성해보세요!
        </div>
      ) : (
        <ul className="space-y-4">
          {diaryList.map((diary) => (
            <li
              key={diary.id}
              onClick={() => navigate(`/diary/${diary.id}`)}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-lg text-gray-800">
                {new Date(diary.date).toLocaleDateString("ko-KR")}
              </h3>
              <p className="text-gray-600 truncate">{diary.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// DiaryPage: 일기 상세 조회
const DiaryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDiary = async () => {
      try {
        const docRef = doc(db, "diaries", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDiary({ id: docSnap.id, ...docSnap.data() } as DiaryEntry);
        } else {
          alert("해당 일기를 찾을 수 없습니다.");
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiary();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "diaries", id));
        alert("일기가 삭제되었습니다.");
        navigate("/", { replace: true });
      } catch (e) {
        console.error(e);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  if (loading) return <div className="text-center p-10">로딩 중...</div>;
  if (!diary) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4 pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          {new Date(diary.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </h1>
      </div>
      <div className="prose max-w-none min-h-[200px]">
        <p>{diary.content}</p>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-gray-800"
        >
          목록으로
        </button>
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

// NewPage: 새 일기 작성
const NewPage = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [content, setContent] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!content.trim() || !date) {
      alert("날짜와 내용을 모두 입력해주세요.");
      return;
    }
    try {
      await addDoc(collection(db, "diaries"), {
        date: new Date(date).getTime(),
        content: content,
        createdAt: Timestamp.now(),
      });
      alert("일기가 성공적으로 저장되었습니다.");
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">새 일기 작성</h1>
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
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          저장
        </button>
      </div>
    </div>
  );
};

// EditPage: 일기 수정
const EditPage = () => {
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

// --- 4. 메인 App 컴포넌트 (src/App.tsx) ---
// 이 파일이 바로 App.tsx의 최종 모습입니다.
const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-gray-100 min-h-screen font-sans">
        <Header />
        <main className="max-w-3xl mx-auto p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/new" element={<NewPage />} />
            <Route path="/diary/:id" element={<DiaryPage />} />
            <Route path="/edit/:id" element={<EditPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
