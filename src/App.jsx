import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import LabDashboard from './pages/LabDashboard';
import ReportView from './pages/ReportView';
import PatientForm from './pages/PatientForm';
import ReportForm from './pages/ReportForm';
import Reports from './pages/Reports';
import NavBar from './components/NavBar';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
    <NavBar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <LabDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/new"
        element={
          <ProtectedRoute>
            <PatientForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/new"
        element={
          <ProtectedRoute>
            <ReportForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/:id"
        element={
          <ProtectedRoute>
            <ReportView />
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  );
}