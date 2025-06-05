// components/UserCreditModal.jsx
import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const UserCreditModal = ({ open, onClose, user }) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={{ p: 3, bgcolor: "#fff", m: "auto", mt: 10, borderRadius: 2, width: 400 }}>
      <Typography variant="h6">اعتبار کاربر</Typography>
      {user && (
        <div>
          <p>نام: {user.fullName}</p>
          <p>اعتبار: {user.credit} تومان</p>
          {/* اینجا می‌توانید دکمه شارژ یا نمایش تراکنش‌ها را هم اضافه کنید */}
        </div>
      )}
      <Button onClick={onClose}>بستن</Button>
    </Box>
  </Modal>
);

export default UserCreditModal;
