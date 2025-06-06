import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.gender || !form.city) {
      setError("لطفا همه فیلدها را پر کنید");
      return;
    }
    setError("");
    navigate("/register-verify", { state: { phone: form.phone } });
  };

  return (
    <div className="form-container">
      <h2>چت بات هوشمند</h2>
      
      <form onSubmit={handleRegister}>
        <Input 
          label="نام و نام خانوادگی" 
          name="name" 
          type="text"
          value={form.name} 
          onChange={handleChange} 
          required 
          placeholder="نام و نام خانوادگی خود را وارد کنید" 
        />
        
        <Input 
          label="ایمیل" 
          name="email" 
          type="email" 
          value={form.email} 
          onChange={handleChange} 
          required 
          placeholder="ایمیل معتبر خود را وارد کنید" 
        />
        
        <Input 
          label="شماره موبایل" 
          name="phone" 
          type="tel" 
          value={form.phone} 
          onChange={handleChange} 
          required 
          placeholder="مثلا 09123456789" 
        />
        
        <div className="gender-group">
          <span>جنسیت:</span>
          <label>
            <input 
              type="radio" 
              name="gender" 
              value="male" 
              checked={form.gender === "male"} 
              onChange={handleChange} 
              required 
            /> 
            مرد
          </label>
          <label>
            <input 
              type="radio" 
              name="gender" 
              value="female" 
              checked={form.gender === "female"} 
              onChange={handleChange} 
              required 
            /> 
            زن
          </label>
        </div>
        
        <Input 
          label="شهر" 
          name="city" 
          type="text"
          value={form.city} 
          onChange={handleChange} 
          required 
        />
        
        {error && <div className="error">{error}</div>}
        
        <button className="btn btn-primary" type="submit">
          ثبت‌نام
        </button>
      </form>
      
      <div className="form-footer">
        <span>قبلاً ثبت‌نام کرده‌اید؟</span>
        <button className="link-btn" onClick={() => navigate("/login")}>
          ورود
        </button>
      </div>
    </div>
  );
}