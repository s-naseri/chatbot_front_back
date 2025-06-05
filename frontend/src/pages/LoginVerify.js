import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Input";

export default function LoginVerify() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleVerify = e => {
    e.preventDefault();
    if (!code) {
      setError("کد تایید را وارد کنید");
      return;
    }
    setError("");
    // اینجا کد تایید را به بک‌اند بفرستید و اگر درست بود:
    navigate("/chat");
  };

  return (
    <div className="form-container">
      <h2>تایید شماره موبایل</h2>
      <p>کد پیامک شده به شماره {state?.phone || ""} را وارد کنید:</p>
      <form onSubmit={handleVerify}>
        <Input label="کد تایید" value={code} onChange={e => setCode(e.target.value)} required />
        {error && <div className="error">{error}</div>}
        <button className="btn btn-primary" type="submit">تایید</button>
      </form>
    </div>
  );
}
