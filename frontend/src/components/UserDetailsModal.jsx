import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

export default function UserDetailsModal({ open, onClose, user }) {
  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2" mb={2}>
          جزئیات کاربر
        </Typography>
        <Typography>نام: {user.fullName}</Typography>
        <Typography>نام کاربری: {user.username}</Typography>
        <Typography>وضعیت: {user.active ? "فعال" : "غیرفعال"}</Typography>
        <Typography>وفادار: {user.loyal ? "بله" : "خیر"}</Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={onClose}>
          بستن
        </Button>
      </Box>
    </Modal>
  );
}
