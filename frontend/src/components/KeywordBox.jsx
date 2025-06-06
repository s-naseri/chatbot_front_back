import React, { useState } from "react";

export default function KeywordBox() {
  const [input, setInput] = useState("");
  const [keywords, setKeywords] = useState([]);

  const handleAdd = () => {
    if (input.trim()) {
      setKeywords([...keywords, input.trim()]);
      setInput("");
    }
  };

  return (
    <div style={{
      background: "#f5f6fa",
      padding: 20,
      fontFamily: 'IRANYekanX', 
      borderRadius: 12,
      marginBottom: 18,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      boxShadow: "0 2px 8px rgba(113,111,243,0.07)"
    }}>
      <div style={{ marginBottom: 8, fontWeight: 600, color: "#716ff3" }}>ثبت نکات و کلمات کلیدی</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="کلمه کلیدی یا نکته..."
          style={{
            padding: "7px 14px",
            fontFamily: 'IRANYekanX',
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: ".75rem",
            outline: "none"
          }}
        />
        <button onClick={handleAdd} style={{
          background: "#716ff3",
          color: "#fff",
          fontFamily: 'IRANYekanX',
          border: "none",
          borderRadius: 8,
          padding: "7px 20px",
          fontWeight: "bold",
          cursor: "pointer"
        }}>
          ثبت
        </button>
      </div>
      <div style={{ marginTop: 10 }}>
        {keywords.map((kw, idx) => (
          <span key={idx} style={{
            display: "inline-block",
            background: "#fff",
            color: "#716ff3",
            border: "1px solid #716ff3",
            borderRadius: 8,
            padding: "3px 12px",
            fontFamily: 'IRANYekanX',
            margin: "0 4px 4px 0",
            fontSize: "0.97rem"
          }}>{kw}</span>
        ))}
      </div>
    </div>
  );
}
