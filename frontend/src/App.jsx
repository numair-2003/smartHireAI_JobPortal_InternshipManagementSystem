import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobsList from './pages/JobsList';
import JobDetail from './pages/JobDetail';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import AIJobGenerator from './pages/AIJobGenerator';
import JobApplications from './pages/JobApplications';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <div className="app-shell flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          <Route path="/student" element={
            <ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/recruiter" element={
            <ProtectedRoute roles={['recruiter', 'admin']}><RecruiterDashboard /></ProtectedRoute>
          } />
          <Route path="/recruiter/post-job" element={
            <ProtectedRoute roles={['recruiter', 'admin']}><PostJob /></ProtectedRoute>
          } />
          <Route path="/recruiter/ai-generator" element={
            <ProtectedRoute roles={['recruiter', 'admin']}><AIJobGenerator /></ProtectedRoute>
          } />
          <Route path="/recruiter/applications/:jobId" element={
            <ProtectedRoute roles={['recruiter', 'admin']}><JobApplications /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
