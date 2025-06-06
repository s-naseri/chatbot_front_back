// src/pages/UserPanel.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatDashboard from "../components/ChatDashboard";
import UsersManagement from "../components/UsersManagement";
import FileUpload from "../components/FileUpload";
import LoyalCustomers from "../components/LoyalCustomers";
import KeywordBox from "../components/KeywordBox";

export default function UserPanel() {
  const [activePanel, setActivePanel] = useState("chat");

  return (
    <div style={{
      fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif",
      background: "#f7f8fa",
      minHeight: "100vh"
    }}>
      <Header />
      <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
        <main style={{
          flex: 1,
          padding: 32,
          background: "#f7f8fa",
          minHeight: "calc(100vh - 70px)",
          overflow: "auto"
        }}>
          {activePanel === "chat" && <ChatDashboard />}
          {activePanel === "users" && <UsersManagement />}
          {activePanel === "upload" && <FileUpload />}
          {activePanel === "loyal" && <LoyalCustomers />}
          {activePanel === "keywords" && <KeywordBox />}
        </main>
      </div>
    </div>
  );
}
