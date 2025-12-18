// src/components/Admin/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "../../assets/adminLayout.css";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSiderbar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* overlay (visible only on mobile when sidebar open) */}
      <div
        className={`mobile-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className={`admin-main ${sidebarOpen ? "sidebar-active" : ""}`}>
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
