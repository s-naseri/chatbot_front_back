import React from "react";

export default function Header() {
  return (
    <header style={{
      
      background: "#fff",
      height: 70,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      borderBottom: "1px solid #e1e5e9",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <h1 style={{ color: "#716ff3", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
        پنل کاربری
      </h1>
      <input
        type="text"
        placeholder="جستجو در همه بخش‌ها..."
        style={{
          
          padding: "8px 16px",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          fontSize: "1rem",
          width: 300,
          outline: "none"
        }}
      />
    </header>
  );
}
