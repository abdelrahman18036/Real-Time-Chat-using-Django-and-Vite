import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import ContactManagement from "./components/ContactManagement";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <WebSocketProvider>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/contacts" element={<ContactManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </WebSocketProvider>
    </Router>
  );
}

export default App;
