import React, { useRef, useState } from "react";

export default function FileUpload() {
  const fileInput = useRef();
  const [message, setMessage] = useState("");

  const handleUpload = e => {
    e.preventDefault();
    const file = fileInput.current.files[0];
    if (!file) {
      setMessage("لطفاً یک فایل انتخاب کنید.");
      return;
    }
    setMessage("فایل با موفقیت آپلود شد (شبیه‌سازی).");
    fileInput.current.value = "";
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#1f2937", marginBottom: 16 }}>
        آپلود فایل
      </h2>
      <form onSubmit={handleUpload} style={{
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        marginBottom: 24
      }}>
        <input
          type="file"
          ref={fileInput}
          style={{
            width: "100%",
            padding: 12,
            border: "2px dashed #d1d5db",
            borderRadius: 8,
            marginBottom: 16
          }}
        />
        <button
          type="submit"
          style={{
            background: "#716ff3",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: 8,
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          آپلود
        </button>
        {message && (
          <div style={{
            marginTop: 12,
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: "0.9rem",
            background: "#d1fae5",
            color: "#065f46"
          }}>{message}</div>
        )}
      </form>
    </div>
  );
}
