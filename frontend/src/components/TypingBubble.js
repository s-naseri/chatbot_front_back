import React, { useEffect, useState } from "react";

export default function TypingBubble({ text, onDone }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayText("");
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, 35); // سرعت تایپ (میلی‌ثانیه)
    return () => clearInterval(interval);
  }, [text, onDone]);

  return (
    <div className="chat-bubble bot">
      <div className="bubble-text">{displayText}<span className="typing-cursor">|</span></div>
    </div>
  );
}
