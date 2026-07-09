import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/guards/ProtectedRoute';
import GuestRoute from './components/guards/GuestRoute';
import AuthLayout from './layouts/AuthLayout';
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

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Homepage accessible to guests and registered users */}
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<MarketsList />} />
          <Route path="/markets/:id" element={<MarketDetails />} />
          <Route path="/news" element={<NewsHub />} />
          <Route path="/community" element={<Community />} />
          <Route path="/user/:username" element={<UserProfile />} />

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

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
