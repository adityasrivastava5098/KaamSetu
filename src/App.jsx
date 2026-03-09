import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SkillLearning from './pages/SkillLearning';
import QuizPage from './pages/QuizPage';
import BadgePage from './pages/BadgePage';
import ReelsPage from './pages/ReelsPage';
import ChatbotPage from './pages/ChatbotPage';
import JobPortal from './pages/JobPortal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning" element={<SkillLearning />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/badges" element={<BadgePage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/jobs" element={<JobPortal />} />
        </Route>
        <Route path="/reels" element={<ReelsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
