import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NoticesPage } from './pages/NoticesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminRoute } from './components/auth/AdminRoute';
import { SupportChat } from './components/SupportChat';
import { AdminMessagesPage } from './pages/AdminMessagesPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f8fafc]">
        {/* Navbar will handle its own visibility based on route */}
        <Navbar />
        
        {/* Main content without a global container to allow full-width pages like Login/Register */}
        <main>
          <Routes>
            <Route path="/" element={<div className="container pb-20"><LandingPage /></div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<div className="container pb-20"><DashboardPage /></div>} />
            <Route path="/notices" element={<div className="container pb-20"><NoticesPage /></div>} />
            <Route path="/notifications" element={<div className="container pb-20"><NotificationsPage /></div>} />
            
            {/* Secure Admin Section */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<div className="container pb-20"><AdminDashboardPage /></div>} />
            </Route>

            <Route path="/profile" element={<div className="container pb-20"><ProfilePage /></div>} />
            <Route path="/maintenance" element={<div className="container pb-20"><MaintenancePage /></div>} />
            <Route path="/complaints" element={<div className="container pb-20"><ComplaintsPage /></div>} />
            <Route path="/facilities" element={<div className="container pb-20"><FacilitiesPage /></div>} />
            <Route path="/directory" element={<div className="container pb-20"><DirectoryPage /></div>} />
            <Route path="*" element={
               <div className="container py-40 text-center animate-fade-in relative">
                  <h1 className="text-9xl font-black text-slate-100 absolute left-1/2 -translate-x-1/2 top-40 z-0">404</h1>
                  <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Access Restricted</h2>
                    <p className="text-slate-500 font-medium mt-2">Under construction for Vrundavan Society.</p>
                  </div>
               </div>
            } />
            <Route path="/admin/messages" element={
              <AdminRoute>
                <AdminMessagesPage />
              </AdminRoute>
            } />
          </Routes>
        </main>
        <SupportChat />
      </div>
    </Router>
  );
}

export default App;
