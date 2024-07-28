import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";

import ContactManagement from "./pages/ContactManagement";
import Header from "./components/Header";
import { useTheme } from './contexts/ThemeContext';

const App = () => {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${theme}`}>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/contacts" element={<ContactManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
