import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => (
  <header className="py-4 px-8 bg-green-500 text-white text-center shadow-md">
    <Link to="/" className="text-3xl font-bold tracking-tight">
      나의 비밀 일기장
    </Link>
  </header>
);

export default Header;
