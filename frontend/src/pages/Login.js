import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";

export default function Login() {
  const [form, setForm] = useState({ username: "", phone: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = e => {
    e.preventDefault();
    if (!form.username || !form.phone) {
      setError("نام کاربری و شماره موبایل را وارد کنید");
      return;
    }
    setError("");
    // اینجا به بک‌اند درخواست ارسال پیامک بدهید
    navigate("/login-verify", { state: { phone: form.phone } });
  };

  return (
    <div className="form-container">
      <h2> چت بات هوشمند </h2>
      <form onSubmit={handleLogin}>
        <Input label="نام کاربری" name="username" value={form.username} onChange={handleChange} required input type="text" id="name" required placeholder="نام و نام خانوادگی خود را وارد کنید"/>
        <Input label="شماره موبایل" name="phone" type="tel" value={form.phone} onChange={handleChange} required input type="text" id="name" required placeholder="مثلا 09123456789"/>
        {error && <div className="error">{error}</div>}
        <button className="btn btn-primary" type="submit">ورود</button>
      </form>
      <div className="form-footer">
        
        <button className="link-btn" onClick={() => navigate("/register")}>ثبت‌نام</button>
        <span>ثبت‌نام نکرده‌اید؟</span>
      </div>
    </div>
  );
}
