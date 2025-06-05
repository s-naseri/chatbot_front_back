import React, { useState } from "react";
import { 
  FaUser, 
  FaHome, 
  FaUsers, 
  FaCog, 
  FaChevronDown, 
  FaUpload,
  FaStar,
  FaKeyboard
} from "react-icons/fa";
import "./Sidebar.css"; // فایل CSS جداگانه

const menuItems = [
  { 
    key: "profile", 
    label: "حساب من", 
    icon: <FaUser />,
    hasSubmenu: false
  },
  { 
    key: "chat", 
    label: "خانه", 
    icon: <FaHome />,
    hasSubmenu: false
  },
  { 
    key: "users", 
    label: "مدیریت کاربران", 
    icon: <FaUsers />,
    hasSubmenu: true,
    submenu: [
      { key: "create-user", label: "ایجاد کاربری" },
      { key: "manage-users", label: "مدیریت کاربران" },
      { key: "transactions", label: "تراکنشات کاربران" },
      { key: "colleagues", label: "مدیریت همکاران" },
      { key: "subsets", label: "مدیریت زیرمجموعه‌ها" },
      { key: "requests", label: "مشاهده درخواست‌ها" }
    ]
  },
  { 
    key: "upload", 
    label: "آپلود فایل", 
    icon: <FaUpload />,
    hasSubmenu: false
  },
  { 
    key: "loyal", 
    label: "مشتریان وفادار", 
    icon: <FaStar />,
    hasSubmenu: false
  },
  { 
    key: "keywords", 
    label: "ثبت کلمات کلیدی", 
    icon: <FaKeyboard />,
    hasSubmenu: false
  },
  { 
    key: "settings", 
    label: "تنظیمات", 
    icon: <FaCog />,
    hasSubmenu: false
  },
];

export default function Sidebar({ activePanel, setActivePanel }) {
  const [expandedMenus, setExpandedMenus] = useState({
    users: false
  });

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleMainClick = (item) => {
    if (item.hasSubmenu) {
      toggleMenu(item.key);
      if (!expandedMenus[item.key]) {
        setActivePanel(item.key);
      }
    } else {
      setActivePanel(item.key);
    }
  };

  const handleSubmenuClick = (parentKey, subKey) => {
    setActivePanel(`${parentKey}-${subKey}`);
  };

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.key}>
            <button
              onClick={() => handleMainClick(item)}
              className={`sidebar-btn ${activePanel === item.key || activePanel.startsWith(item.key) ? "active" : ""}`}
              aria-expanded={expandedMenus[item.key] || false}
            >
              <div className="sidebar-btn-content">
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.hasSubmenu && (
                <span className={`sidebar-chevron ${expandedMenus[item.key] ? "expanded" : ""}`}>
                  <FaChevronDown />
                </span>
              )}
            </button>

            {item.hasSubmenu && expandedMenus[item.key] && (
              <ul className="sidebar-submenu">
                {item.submenu.map(sub => (
                  <li key={sub.key}>
                    <button
                      onClick={() => handleSubmenuClick(item.key, sub.key)}
                      className={`sidebar-subbtn ${activePanel === `${item.key}-${sub.key}` ? "active" : ""}`}
                    >
                      {sub.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
