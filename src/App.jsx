import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import SkillLearning from './pages/SkillLearning';
import QuizPage from './pages/QuizPage';
import BadgePage from './pages/BadgePage';
import ReelsPage from './pages/ReelsPage';
import ChatbotPage from './pages/ChatbotPage';
import JobPortal from './pages/JobPortal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learning" element={<SkillLearning />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />
            <Route path="/badges" element={<BadgePage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/jobs" element={<JobPortal />} />
          </Route>
          <Route path="/reels" element={
            <ProtectedRoute>
              <ReelsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
