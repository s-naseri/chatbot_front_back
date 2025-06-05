// components/ManagerPanel.jsx
import React from "react";
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { FaExclamationCircle, FaDollarSign, FaComments } from "react-icons/fa";

const ManagerPanel = ({
  users,
  onToggleActive,
  onShowDetails,
  onShowCredit,
  onShowChatHistory,
}) => (
  <div>
    <h2>پنل مدیر</h2>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>نام مشتری</TableCell>
          <TableCell>نام کاربری</TableCell>
          <TableCell>اعتبار (تومان)</TableCell>
          <TableCell>وضعیت</TableCell>
          <TableCell>عملیات</TableCell>
          <TableCell>تاریخچه چت</TableCell> {/* ستون جدید */}
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.fullName}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.credit}</TableCell>
            <TableCell>
              <Button
                variant={user.active ? "contained" : "outlined"}
                color={user.active ? "success" : "error"}
                onClick={() => onToggleActive(user.id)}
              >
                {user.active ? "فعال" : "غیرفعال"}
              </Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => onShowDetails(user.id)} title="جزئیات">
                <FaExclamationCircle />
              </Button>
              <Button onClick={() => onShowCredit(user.id)} title="اعتبار">
                <FaDollarSign />
              </Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => onShowChatHistory(user.id)} title="تاریخچه چت">
                <FaComments />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default ManagerPanel;
