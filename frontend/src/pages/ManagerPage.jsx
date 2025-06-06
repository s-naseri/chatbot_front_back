import React, { useState } from "react";
import ManagerPanel from "../components/ManagerPanel";
import UserDetailsModal from "../components/UserDetailsModal";
import UserCreditModal from "../components/UserCreditModal";
import ChatHistoryModal from "../components/ChatHistoryModal";

const mockUsers = [
  {
    id: 1,
    fullName: "علی رضایی",
    username: "ali",
    credit: 120000,
    active: true,
    type: "حقیقی",
    chatHistory: [
      { sender: "علی رضایی", message: "سلام، وضعیت سفارش من چیست؟", time: "۱۴۰۲/۰۳/۱۰ ۱۰:۰۰" },
      { sender: "ادمین", message: "سلام، سفارش شما در حال پردازش است.", time: "۱۴۰۲/۰۳/۱۰ ۱۰:۰۵" },
    ],
  },
  {
    id: 2,
    fullName: "شرکت مدرن",
    username: "modern",
    credit: 50000,
    active: false,
    type: "حقوقی",
    chatHistory: [],
  },
];

const ManagerPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  // فقط یکی از این سه حالت باید true باشد
  const [modalType, setModalType] = useState(null); // 'details' | 'credit' | 'chatHistory' | null

  const handleToggleActive = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const openModal = (id, type) => {
    const user = users.find(u => u.id === id);
    setSelectedUser(user);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  return (
    <div>
      <ManagerPanel
        users={users}
        onToggleActive={handleToggleActive}
        onShowDetails={(id) => openModal(id, "details")}
        onShowCredit={(id) => openModal(id, "credit")}
        onShowChatHistory={(id) => openModal(id, "chatHistory")}
      />

      {/* فقط یک مودال در هر لحظه باز است */}
      {modalType === "details" && selectedUser && (
        <UserDetailsModal
          open={true}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}

      {modalType === "credit" && selectedUser && (
        <UserCreditModal
          open={true}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}

      {modalType === "chatHistory" && selectedUser && (
        <ChatHistoryModal
          user={selectedUser}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ManagerPage;
