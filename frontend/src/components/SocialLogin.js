import React from "react";

export default function SocialLogin() {
  return (
    <div className="social-login">
      <button className="social-btn google">
        <span role="img" aria-label="Google">🌐</span> ورود با گوگل
      </button>
      <button className="social-btn apple">
        <span role="img" aria-label="Apple">🍏</span> ورود با اپل
      </button>
    </div>
  );
}
