// pages/AdminPage.jsx
import React, { useState } from "react";
import AdminPanel from "../components/AdminPanel";
import UserDetailsModal from "../components/UserDetailsModal";

const mockUsers = [
  { id: 1, fullName: "علی رضایی", username: "ali", active: true, type: "حقیقی" },
  { id: 2, fullName: "شرکت مدرن", username: "modern", active: false, type: "حقوقی" },
];

const AdminPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleToggleActive = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const handleShowDetails = (id) => {
    setSelectedUser(users.find(u => u.id === id));
  };

  const handleCloseModal = () => setSelectedUser(null);

  return (
    <div>
      <AdminPanel
        users={users}
        onToggleActive={handleToggleActive}
        onShowDetails={handleShowDetails}
      />
      <UserDetailsModal
        open={!!selectedUser}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
};

export default AdminPage;
