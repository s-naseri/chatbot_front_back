import React from "react";

export default function LoyalCustomers({ users, onRemoveLoyal }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(113,111,243,0.07)",
      padding: 24
    }}>
      <h3 style={{ color: "#716ff3", fontWeight: "bold", marginBottom: 18 }}>مشتریان وفادار</h3>
      {users.length === 0 ? (
        <p style={{ color: "#888" }}>مشتری وفاداری وجود ندارد.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {users.map(user => (
            <li key={user.id} style={{
              padding: "10px 0",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>{user.fullName} ({user.username})</span>
              <button
                onClick={() => onRemoveLoyal(user.id)}
                style={{
                  background: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  cursor: "pointer"
                }}
              >
                حذف از وفادارها
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
