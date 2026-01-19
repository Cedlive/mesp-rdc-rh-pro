import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Payroll } from './pages/Payroll';
import { Communication } from './pages/Communication';
import { Employees } from './pages/Employees';
import { Services } from './pages/Services';
import { Leaves } from './pages/Leaves';
import { Settings } from './pages/Settings';
import { Recruitment } from './pages/Recruitment';
import { Performance } from './pages/Performance';
import { Training } from './pages/Training';
import { Analytics } from './pages/Analytics';
import { Documents } from './pages/Documents';
import { Expenses } from './pages/Expenses';
import { Surveys } from './pages/Surveys';
import { Roles } from './pages/Roles';
import { Medical } from './pages/Medical';
import { Informations } from './pages/Informations';  // ✅ NOUVEAU IMPORT
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AILab } from './pages/AILab';
import { SplashScreen } from './components/SplashScreen';
import { AlertManager } from './components/AlertManager';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null; 
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, login, logout, currentUser } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <Router>
      <AlertManager />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={login} />} />
        <Route path="/register" element={<Register onRegister={() => {}} />} />
        
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout currentUser={currentUser} onLogout={logout}>
              <Routes>
                <Route path="/" element={<Dashboard currentUser={currentUser} />} />
                <Route path="/ai-lab" element={<AILab />} />
                <Route path="/medical" element={<Medical />} />
                
                {/* ✅ NOUVELLE ROUTE AJOUTÉE */}
                <Route path="/informations" element={<Informations />} />
                
                <Route path="/services" element={<Services />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/leaves" element={<Leaves />} />
                <Route path="/recruitment" element={<Recruitment />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/training" element={<Training />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/surveys" element={<Surveys />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/communication" element={<Communication />} />
                <Route path="/settings" element={<Settings currentLogo={null} onLogoChange={()=>{}} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </AuthProvider>
);

export default App;
