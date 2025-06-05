import React from "react";

export default function ChatHistoryModal({ user, onClose }) {
  // اگر user مقدار نداشته باشد، مودال رندر نشود
  if (!user) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#333" }}>
            تاریخچه چت با {user.fullName}
          </h3>
          <button onClick={onClose} style={closeBtnStyle}>×</button>
        </div>
        <div style={{ marginTop: 16, maxHeight: 600, minHeight: 350, overflowY: "auto" }}>
          {user.chatHistory && user.chatHistory.length > 0 ? (
            user.chatHistory.map((msg, idx) => (
              <div key={idx} style={{
                marginBottom: 12,
                padding: "8px 10px",
                borderRadius: 8,
                background: msg.sender === "ادمین" ? "#eef1fd" : "#f5f6fa",
                alignSelf: msg.sender === "ادمین" ? "flex-end" : "flex-start",
                fontSize: "0.92rem"
              }}>
                <div style={{ fontWeight: 600, color: "#716ff3", fontSize: "0.95rem" }}>{msg.sender}</div>
                <div style={{ color: "#222", margin: "4px 0", fontSize: "0.9rem" }}>{msg.message}</div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>{msg.time}</div>
              </div>
            ))
          ) : (
            <div style={{ color: "#888", textAlign: "center" }}>تاریخچه چت موجود نیست.</div>
          )}
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "#fff",
  borderRadius: 12,
  padding: 32,
  minWidth: 540,
  maxWidth: 700,
  boxShadow: "0 2px 16px rgba(0,0,0,0.18)"
};

const closeBtnStyle = {
  background: "#fff",
  border: "none",
  fontSize: "1.5rem",
  color: "#888",
  cursor: "pointer",
  borderRadius: "50%",
  width: 32,
  height: 32,
  lineHeight: "32px",
  textAlign: "center"
};
