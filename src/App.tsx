import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Analytics from './pages/Analytics';
import Scholarships from './pages/Scholarships';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { session, loading } = useAuth();

  // While resolving session don't render routes yet (ProtectedRoute handles its own spinner)
  if (loading) return null;

  return (
    <Routes>
      {/* Public routes — redirect to dashboard if already logged in */}
      <Route
        path="/login"
        element={session ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={session ? <Navigate to="/" replace /> : <Signup />}
      />

      {/* Protected routes — ProtectedRoute redirects to /login if no session */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="scholarships" element={<Scholarships />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={session ? '/' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
