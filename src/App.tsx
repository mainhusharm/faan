import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import PracticePage from './pages/PracticePage';
import CrashCoursePage from './pages/CrashCoursePage';
import TestPage from './pages/TestPage';
import TestVideoPage from './pages/TestVideoPage';
import CreativeLearningPage from './pages/CreativeLearningPage';
import SettingsPage from './pages/SettingsPage';
import CourseCreationPage from './pages/CourseCreationPage';
import HomeworkPage from './pages/HomeworkPage';
import DiagramPage from './pages/DiagramPage';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <div className="pt-20">
              <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute>
                  <CoursesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course/:courseId" 
              element={
                <ProtectedRoute>
                  <CourseDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/practice" 
              element={
                <ProtectedRoute>
                  <PracticePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/crash-course" 
              element={
                <ProtectedRoute>
                  <CrashCoursePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test" 
              element={
                <ProtectedRoute>
                  <TestPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test-video" 
              element={
                <ProtectedRoute>
                  <TestVideoPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creative-learning" 
              element={
                <ProtectedRoute>
                  <CreativeLearningPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test-settings" 
              element={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Test Settings Route
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    This is a test route to verify routing works.
                  </p>
                </div>
              }
            />
            <Route 
              path="/api-settings" 
              element={<SettingsPage />}
            />
            <Route 
              path="/create-course" 
              element={
                <ProtectedRoute>
                  <CourseCreationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/homework" 
              element={
                <ProtectedRoute>
                  <HomeworkPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/diagram" 
              element={
                <ProtectedRoute>
                  <DiagramPage />
                </ProtectedRoute>
              } 
            />
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;