import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatDashboard from "../components/ChatDashboard";
import AdminProfile from "../components/AdminProfile";
import Settings from "../components/Settings";
import FileUpload from "../components/FileUpload";
import LoyalCustomers from "../components/LoyalCustomers";
import KeywordBox from "../components/KeywordBox";
import UserCreateForm from "../components/UserCreateForm";
import UserTransactions from "../components/UserTransactions";
import ColleaguesManagement from "../components/ColleaguesManagement";
import SubsetsManagement from "../components/SubsetsManagement";
import RequestsManagement from "../components/RequestsManagement";
import UserDetailsModal from "../components/UserDetailsModal";
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";


export default function AdminPanel() {
  const [activePanel, setActivePanel] = useState("chat");

  const [users, setUsers] = useState([
    { id: 1, fullName: "علی رضایی", username: "ali", email: "ali@example.com", mobile: "09121234567", city: "تهران", active: true, loyal: false },
    { id: 2, fullName: "زهرا محمدی", username: "zahra", email: "zahra@example.com", mobile: "09129876543", city: "اصفهان", active: false, loyal: true },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, userId: 1, date: "1402/03/01", amount: 150000, type: "خرید", status: "موفق" },
    { id: 2, userId: 2, date: "1402/03/05", amount: 50000, type: "شارژ", status: "ناموفق" },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // توابع مدیریت کاربران
  const handleToggleActive = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const handleToggleLoyal = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, loyal: !u.loyal } : u));
  };

  const handleShowDetails = (id) => {
    const user = users.find(u => u.id === id);
    setSelectedUser(user);
  };

  const handleCloseModal = () => setSelectedUser(null);

  // فیلتر کاربران بر اساس جستجو
  const filteredUsers = users.filter(user =>
    [user.fullName, user.mobile, user.city, user.username].some(field =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // رندر بخش‌ها بر اساس تب فعال
  const renderContent = () => {
    switch (activePanel) {
      case "profile":
        return <AdminProfile />;
      case "chat":
        return (
          <ChatDashboard
            users={users}
            onToggleLoyal={handleToggleLoyal}
            onGoToLoyal={(id) => {
              setUsers(users.map(u => u.id === id ? { ...u, loyal: true } : u));
              setActivePanel("loyal");
            }}
          />
        );
      case "users-create-user":
        return <UserCreateForm onSubmit={(newUser) => {
          setUsers([...users, { ...newUser, id: Date.now(), active: true, loyal: false }]);
          setActivePanel("users-manage-users"); // بعد از ایجاد کاربر برگرد به مدیریت کاربران
        }} />;
      case "users-manage-users":
        return (
          <>
            <TextField
              label="جستجو بر اساس نام، شماره، شهر یا شناسه"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>نام کامل</TableCell>
                  <TableCell>نام کاربری</TableCell>
                  <TableCell>ایمیل</TableCell>
                  <TableCell>شماره موبایل</TableCell>
                  <TableCell>شهر</TableCell>
                  <TableCell>وضعیت</TableCell>
                  <TableCell>عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>
                      <Button
                        variant={user.active ? "contained" : "outlined"}
                        color={user.active ? "success" : "error"}
                        onClick={() => handleToggleActive(user.id)}
                      >
                        {user.active ? "فعال" : "غیرفعال"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => handleShowDetails(user.id)}>
                        جزئیات
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        );
      case "users-transactions":
        return <UserTransactions transactions={transactions} />;
      case "users-colleagues":
        return <ColleaguesManagement />;
      case "users-subsets":
        return <SubsetsManagement />;
      case "users-requests":
        return <RequestsManagement />;
      case "upload":
        return <FileUpload />;
      case "loyal":
        return (
          <LoyalCustomers
            users={users.filter(u => u.loyal)}
            onRemoveLoyal={handleToggleLoyal}
          />
        );
      case "keywords":
        return <KeywordBox />;
      case "settings":
        return <Settings />;
      default:
        return <ChatDashboard users={users} />;
    }
  };

  return (
    <div style={{
      fontFamily: 'IranYekanX',
      background: "#f7f8fa",
      minHeight: "100vh"
    }}>
      <Header />
      <div style={{ fontFamily: 'IranYekanX',display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
        <main style={{
          flex: 1,
          padding: 32,
          background: "#f7f8fa",
          minHeight: "calc(100vh - 70px)",
          overflow: "auto"
        }}>
          <div style={{fontFamily: 'IranYekanX',
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 2px 8px rgba(113,111,243,0.07)"
          }}>
            {renderContent()}
          </div>
        </main>
      </div>

      {selectedUser && (
        <UserDetailsModal
          open={true}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}
    </div>
  );
}
