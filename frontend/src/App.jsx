import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import TopicAssignmentPage from './pages/TopicAssignmentPage';
import ReportsPage from './pages/ReportsPage';
import UserDashboardPage from './pages/UserDashboardPage';
import TopicDetailsPage from './pages/TopicDetailsPage';
import SubtopicDetailsPage from './pages/SubtopicDetailsPage';
import ProgressTrackerPage from './pages/ProgressTrackerPage';
import LearningResourcesPage from './pages/LearningResourcesPage';
import AdminNotesViewPage from './pages/AdminNotesViewPage';
import CertificationsPage from './pages/CertificationsPage';
import SettingsPage from './pages/SettingsPage';
import AdminTopicsPage from './pages/AdminTopicsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/assignments" element={<TopicAssignmentPage />} />
          <Route path="/admin/topics" element={<AdminTopicsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/certificates" element={<CertificationsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/notes" element={<AdminNotesViewPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute roles={['user']} />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/resources" element={<LearningResourcesPage />} />
          <Route path="/topics/:topicName" element={<TopicDetailsPage />} />
          <Route path="/topics/:topicName/:subtopicName" element={<SubtopicDetailsPage />} />
          <Route path="/progress" element={<ProgressTrackerPage />} />
          <Route path="/certificates" element={<CertificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
