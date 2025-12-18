import React from "react";
import { NavLink } from "react-router-dom";
import vitLogo from "../../assets/vit-logo-white.png";
import {
  MdDashboard,
  MdGroups,
  MdChecklist,
  MdPeople,
  MdAssignmentTurnedIn,
  MdClose,
} from "react-icons/md";
import "../../assets/adminSidebar.css";

const AdminSidebar = ({ open, setOpen }) => {
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <aside className={`sidebar-container ${open ? "show" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img src={vitLogo} alt="vit-logo" className="vit-logo" />
        </div>

        <button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Close menu">
          <MdClose />
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/admin/" className={linkClass}>
              <MdDashboard className="icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/role" className={linkClass}>
              <MdGroups className="icon" />
              <span>Roles</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/checklist" className={linkClass}>
              <MdChecklist className="icon" />
              <span>Checklist</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/user" className={linkClass}>
              <MdPeople className="icon" />
              <span>Users</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/onboarding" className={linkClass}>
              <MdAssignmentTurnedIn className="icon" />
              <span>Onboarding Status</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
