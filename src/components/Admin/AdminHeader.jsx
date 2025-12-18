import React from "react";
import "../../assets/adminHeader.css";
import { MdMenu } from "react-icons/md";
import { useLocation } from "react-router-dom";
const AdminHeader = ({ setSidebarOpen }) => {
  const location = useLocation();
  const getPageTitle = () => {
    if (location.pathname.includes("/user")) return "Users";
    if (location.pathname.includes("/role")) return "Roles";
    if (location.pathname.includes("/checklist")) return "Checklist";
    if (location.pathname.includes("/onboarding")) return "Onboarding";
    return "Dashboard";
  };

  return (
    <header className="header">
      <div className="left-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <MdMenu />
        </button>

        <div className="page-title">{getPageTitle()}</div>
      </div>
      <div className="header-right">
        <img src="https://i.pravatar.cc/40" className="profile-img" alt="profile" />
      </div>
    </header>
  );
};

export default AdminHeader;
