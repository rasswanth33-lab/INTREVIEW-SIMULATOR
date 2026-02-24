import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import CompanySelection from './pages/CompanySelection';
import RoleSelection from './pages/RoleSelection';
import Interview from './pages/Interview';
import Results from './pages/Results';

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
            <Route path="/companies" element={<CompanySelection />} />
            <Route path="/roles/:companyId" element={<RoleSelection />} />
            <Route path="/interview/:companyId/:roleId" element={<Interview />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
