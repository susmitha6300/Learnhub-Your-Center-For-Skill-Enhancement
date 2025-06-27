import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import CourseDetail from './pages/CourseDetail'
import Profile from './pages/Profile'
import MyCourses from './pages/MyCourses'
import CreateCourse from './pages/CreateCourse'
import Analytics from './pages/Analytics'
import DashboardStudent from './pages/DashboardStudent'
import DashboardTeacher from './pages/DashboardTeacher'
import DashboardAdmin from './pages/DashboardAdmin'

import ProtectedRoute, { AdminRoute, TeacherRoute, PublicRoute } from './components/ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      
      {/* Auth Routes (redirect if logged in) */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
      
      {/* Student Routes */}
      <Route path="/dashboard/student" element={<ProtectedRoute requiredRoles={['student', 'teacher', 'admin']}><DashboardStudent /></ProtectedRoute>} />
      
      {/* Teacher Routes */}
      <Route path="/dashboard/teacher" element={<TeacherRoute><DashboardTeacher /></TeacherRoute>} />
      <Route path="/create-course" element={<TeacherRoute><CreateCourse /></TeacherRoute>} />
      
      {/* Admin Routes */}
      <Route path="/dashboard/admin" element={<AdminRoute><DashboardAdmin /></AdminRoute>} />
      <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
    </Routes>
  )
}
export default AppRoutes;
