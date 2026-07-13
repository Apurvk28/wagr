import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/guards/ProtectedRoute';
import GuestRoute from './components/guards/GuestRoute';
import AdminRoute from './components/guards/AdminRoute';
import AuthLayout from './layouts/AuthLayout';
import ToastNotification from './components/ToastNotification';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import MarketsList from './pages/MarketsList';
import MarketDetails from './pages/MarketDetails';
import CreateMarket from './pages/CreateMarket';
import NewsHub from './pages/NewsHub';
import Community from './pages/Community';
import UserProfile from './pages/UserProfile';
import AdminPanel from './pages/AdminPanel';
import Leaderboard from './pages/Leaderboard';
import AboutUs from './pages/AboutUs';
import ContactSupport from './pages/ContactSupport';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          {/* Automatically scrolls viewport to top on path transitions */}
          <ScrollToTop />
          {/* Global toast notification overlay — fires on socket events */}
          <ToastNotification />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/markets" element={<MarketsList />} />
            <Route path="/markets/:id" element={<MarketDetails />} />
            <Route path="/news" element={<NewsHub />} />
            <Route path="/community" element={<Community />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/support" element={<ContactSupport />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />

            {/* Guest-only Auth routes */}
            <Route element={<GuestRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
              </Route>
            </Route>

            {/* Protected Main Dashboard */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/markets/create" element={<CreateMarket />} />
            </Route>

            {/* Admin-only Panel */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

