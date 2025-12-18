import { BrowserRouter, Route, Routes } from "react-router-dom"
import ClientHeader from "./layout/ClientHeader"
import Login from "./components/Client/Login"
import Registration from "./components/Client/Registration";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/index.css";
import Dashboard from "./components/Client/Dashboard";
import ProtectedRoute from "./layout/ProtectedRoute";
import PublicRoute from "./layout/PublicRoute";

import AdminUserContent from "./components/Admin/AdminUserContent";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminRole from "./components/Admin/AdminRole";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminOnboarding from "./components/Admin/AdminOnboarding";
import AdminChecklist from "./components/Admin/AdminChecklist";
import AdminRoleForm from "./components/Admin/AdminRoleForm";
import AdminChecklistForm from "./components/Admin/AdminChecklistForm";
import AdminLogin from "./components/Admin/AdminLogin";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ClientHeader />}>
              <Route path="" element={<Dashboard />} />
            </Route>
          </Route>

          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/admin/" element={<AdminLayout />}>
            <Route path="" element={<AdminDashboard />} />
            <Route path="user" element={<AdminUserContent />} />
            <Route path="role" element={<AdminRole />} />
            <Route path="roleform" element={<AdminRoleForm />} />
            <Route path="roleform/:roleId" element={<AdminRoleForm />} />
            <Route path="checklist" element={<AdminChecklist />} />
            <Route path="checklistform" element={<AdminChecklistForm />} />
            <Route path="checklistform/:checklistId" element={<AdminChecklistForm />} />
            <Route path="onboarding" element={<AdminOnboarding />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
    </BrowserRouter>
  )
}

export default App
