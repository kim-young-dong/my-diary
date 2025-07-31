import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DiaryPage from "./pages/DiaryPage";
import NewPage from "./pages/NewPage";
import EditPage from "./pages/EditPage";

import Header from "./components/Header";
import Footer from "./components/Footer";

// --- 3. 페이지 컴포넌트 (src/pages/*.tsx) ---

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
