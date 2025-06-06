import React from "react";

export default function ChatBubble({ text, isBot }) {
  return (
    <div className={`chat-bubble ${isBot ? "bot" : "user"}`}>
      <div className="bubble-text">{text}</div>
    </div>
  );
}
