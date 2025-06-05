import React, { useState } from "react";
import { TextField, Button, Alert, Box } from "@mui/material";

export default function AdminProfile() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // اعتبارسنجی
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("رمز عبور جدید و تکرار آن یکسان نیستند");
      setIsSuccess(false);
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setMessage("رمز عبور باید حداقل ۶ کاراکتر باشد");
      setIsSuccess(false);
      return;
    }

    // شبیه‌سازی تغییر رمز عبور
    setMessage("رمز عبور با موفقیت تغییر کرد");
    setIsSuccess(true);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <Box sx={{ 
      maxWidth: 500, 
      mx: "auto", 
      bgcolor: "#fff", 
      p: 3, 
      borderRadius: 2, 
      boxShadow: "0 2px 8px rgba(113,111,243,0.07)" 
    }}>
      <h3 style={{ color: "#716ff3", marginBottom: 24 }}>تغییر رمز عبور</h3>
      
      {message && (
        <Alert severity={isSuccess ? "success" : "error"} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="رمز عبور فعلی"
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
          required
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="رمز عبور جدید"
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
          required
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="تکرار رمز عبور جدید"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          required
          sx={{ mb: 3 }}
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth
          sx={{ bgcolor: "#716ff3" }}
        >
          تغییر رمز عبور
        </Button>
      </form>
    </Box>
  );
}
