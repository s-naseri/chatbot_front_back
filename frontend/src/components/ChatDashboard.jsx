import React from "react";
import { FaStar } from "react-icons/fa";
import KeywordBox from "./KeywordBox";

export default function ChatDashboard({ users = [], onToggleLoyal, onGoToLoyal }) {
  return (
    <div style={{ fontFamily: "IranYekanX, Tahoma, Arial, sans-serif", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(113,111,243,0.07)" }}>
      <KeywordBox />
      <h3 style={{ color: "#716ff3", fontWeight: "bold", marginBottom: 16 }}>لیست چت‌ها</h3>
      {users.length === 0 ? (
        <p>هیچ کاربری برای نمایش وجود ندارد.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {users.map(user => (
            <li key={user.id} style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #e1e5e9",
              padding: "14px 0"
            }}>
              <span style={{ flex: 1, fontSize: "1.05rem" }}>
                {user.fullName} ({user.username})
              </span>
              <button
                onClick={() => onToggleLoyal(user.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: user.loyal ? "#FFD700" : "#bbb",
                  fontSize: "1.5rem",
                  marginLeft: 12
                }}
                title={user.loyal ? "مشتری وفادار" : "افزودن به مشتریان وفادار"}
              >
                <FaStar />
              </button>
              {!user.loyal && (
                <button
                  onClick={() => onGoToLoyal(user.id)}
                  style={{
                    background: "#fff",
                    border: "1px solid #716ff3",
                    color: "#716ff3",
                    borderRadius: 8,
                    padding: "4px 12px",
                    fontWeight: "bold",
                    marginRight: 8,
                    cursor: "pointer"
                  }}
                >
                  انتقال به وفادار
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
