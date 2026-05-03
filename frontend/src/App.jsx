import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AuthPage } from "./features/auth/AuthPage";
import { AdminPage } from "./pages/AdminPage";
import { PortalHomePage } from "./pages/PortalHomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { StorePage } from "./pages/StorePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortalHomePage />} />
      <Route path="/customer" element={<StorePage />} />
      <Route path="/customer/login" element={<AuthPage variant="customer-login" />} />
      <Route path="/customer/register" element={<AuthPage variant="customer-register" />} />
      <Route path="/admin/login" element={<AuthPage variant="admin-login" />} />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute customerOnly>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
