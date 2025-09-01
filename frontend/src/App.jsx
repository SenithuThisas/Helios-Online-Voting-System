import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import Elections from './pages/Elections';
import ElectionDetail from './pages/ElectionDetail';
import VotingHistory from './pages/VotingHistory';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/executive/dashboard" 
                element={
                  <ProtectedRoute executiveOnly>
                    <ExecutiveDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/elections" 
                element={
                  <ProtectedRoute>
                    <Elections />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/elections/:id" 
                element={
                  <ProtectedRoute>
                    <ElectionDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/voting-history" 
                element={
                  <ProtectedRoute>
                    <VotingHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
