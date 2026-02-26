import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import CompanySelection from './pages/CompanySelection';
import RoleSelection from './pages/RoleSelection';
import Interview from './pages/Interview';
import Results from './pages/Results';

// Protect routes that require a JWT token
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col relative">
          {/* Subtle background glow effect consistent across app */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none"></div>

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/companies" element={<ProtectedRoute><CompanySelection /></ProtectedRoute>} />
            <Route path="/roles/:companyId" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
            <Route path="/interview/:companyId/:roleId" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

