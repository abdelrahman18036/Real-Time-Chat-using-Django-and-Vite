import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Demochat from "./components/Demochat";
import ContactManagement from "./pages/ContactManagement";
import Header from "./components/Header";
import { useTheme } from './contexts/ThemeContext';

const App = () => {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${theme} transition-colors duration-500`}>
        <Header />
        <main className="flex-1 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/contacts" element={<ContactManagement />} />
            <Route path="/demochat" element={<Demochat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
