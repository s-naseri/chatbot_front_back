import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import Register from "./pages/Register";
import RegisterVerify from "./pages/RegisterVerify";
import Login from "./pages/Login";
import LoginVerify from "./pages/LoginVerify";
import Chat from "./pages/Chat";
import ManagerPage from "./pages/ManagerPage";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme"; // فرض بر این است که تم را در فایل theme.js تعریف کرده‌اید

import "./App.css";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* مسیرهای ثبت‌نام و ورود */}
          <Route path="/register" element={<Register />} />
          <Route path="/register-verify" element={<RegisterVerify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-verify" element={<LoginVerify />} />

          {/* صفحه چت */}
          <Route path="/chat" element={<Chat />} />

          {/* مسیرهای پنل ادمین و مدیر */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/manager" element={<ManagerPage />} />

          {/* مسیر پیش‌فرض */}
          <Route path="*" element={<Register />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
