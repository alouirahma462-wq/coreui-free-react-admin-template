import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/changePassword/ChangePassword.jsx";
import Dashboard from "./views/pages/dashboard/Dashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* الافتراضي */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}








