import React, { useRef, useState, useEffect } from "react";
import logo from "../assets/logo.png"; // لوگوی خود را اینجا قرار بده
import { ReactComponent as AttachIcon } from "../assets/attach.svg";
import { ReactComponent as ImageIcon } from "../assets/image.svg";
import { ReactComponent as MicIcon } from "../assets/mic.svg";

export default function Chat() {
  const [messages, setMessages] = useState([
    { text: "سلام! چطور می‌تونم کمکتون کنم؟", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const chatEndRef = useRef(null);

  // شبیه‌سازی پاسخ چت‌بات
  const getBotResponse = async (msg) => {
    return "این پاسخ نمونه‌ای به پیام شماست: " + msg;
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    setMessages((msgs) => [...msgs, { text: input, isBot: false }]);
    setInput("");
    setIsTyping(true);
    const botReply = await getBotResponse(input);
    setTypingText(botReply);
    setTypingIndex(0);
  };

  // افکت تایپ تدریجی
  useEffect(() => {
    if (isTyping && typingText) {
      if (typingIndex < typingText.length) {
        const timeout = setTimeout(() => {
          setTypingIndex(typingIndex + 1);
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { text: typingText, isBot: true }
        ]);
        setIsTyping(false);
        setTypingText("");
        setTypingIndex(0);
      }
    }
  }, [isTyping, typingText, typingIndex]);

  // اسکرول خودکار به آخر پیام‌ها
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, typingIndex]);

  // هندل دکمه‌ها (در این نسخه فقط پیام تست می‌فرستد)
  const handleAttach = () => alert("امکان ارسال فایل به زودی اضافه می‌شود!");
  const handleImage = () => alert("امکان ارسال تصویر به زودی اضافه می‌شود!");
  const handleMic = () => alert("امکان ارسال پیام صوتی به زودی اضافه می‌شود!");

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="logo-circle">
          <img src={logo} alt="لوگو" className="chat-logo" />
        </div>
        <span className="chat-title">چت‌بات</span>
      </header>
      <main className="chat-main">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.isBot
                ? "chat-bubble bot"
                : "chat-bubble user"
            }
          >
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble bot">
            {typingText.slice(0, typingIndex)}
            <span className="typing-cursor">|</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>
      <footer className="chat-footer">
        <form
          className="chat-input-row"
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
        >
          <button type="button" className="icon-btn" title="ضمیمه" onClick={handleAttach}>
            <AttachIcon />
          </button>
          <button type="button" className="icon-btn" title="تصویر" onClick={handleImage}>
            <ImageIcon />
          </button>
          <button type="button" className="icon-btn" title="پیام صوتی" onClick={handleMic}>
            <MicIcon />
          </button>
          <input
            className="chat-input"
            type="text"
            placeholder="پیام خود را بنویسید..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isTyping}
            style={{ fontFamily: "'IranYekanX', Tahoma, Arial, sans-serif" }}
            autoFocus
          />
          <button className="send-btn" type="submit" disabled={isTyping || !input.trim()}>
            ارسال
          </button>
        </form>
      </footer>
    </div>
  );
}
