import React from "react";

const Footer: React.FC = () => (
  <footer className="text-center py-4 mt-8 text-gray-500 text-sm">
    Copyright © {new Date().getFullYear()} My Diary App. All rights reserved.
  </footer>
);

export default Footer;
