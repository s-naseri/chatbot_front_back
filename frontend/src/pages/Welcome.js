import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="welcome-bg">
      <div className="welcome-card">
        <div className="avatar-circle">
          <span className="avatar-letter">چ</span>
        </div>
        <h2 className="welcome-title">همراه هوشمند شما برای هر زمان</h2>
        <p className="welcome-desc">
          چت‌بات هوشمند شما آماده پاسخگویی، مشاوره و الهام‌بخشی در هر زمان و هر جا.
        </p>
        <div className="feature-list">
          <div className="feature-item">
            <span className="feature-icon">💬</span>
            <div>
              <strong>پاسخ فوری</strong>
              <p>دریافت پاسخ سریع و دقیق به سوالات شما در لحظه.</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <div>
              <strong>مشاوره شخصی</strong>
              <p>راهنمایی و مشاوره متناسب با نیازهای شما.</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            <div>
              <strong>الهام‌بخشی همیشه</strong>
              <p>دسترسی به ایده‌ها و راه‌حل‌های خلاقانه در هر زمان.</p>
            </div>
          </div>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-outline" onClick={() => navigate("/login")}>ورود</button>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>ثبت‌نام</button>
        </div>
      </div>
    </div>
  );
}
