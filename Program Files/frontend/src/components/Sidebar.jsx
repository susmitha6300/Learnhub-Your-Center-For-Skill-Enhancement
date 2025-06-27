import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../utils/constants';

const sidebarItems = {
  [USER_ROLES.STUDENT]: [
    { path: '/dashboard/student', label: 'Dashboard', icon: '🏠' },
    { path: '/my-courses', label: 'My Courses', icon: '📚' },
    { path: '/browse', label: 'Browse Courses', icon: '🔍' },
    { path: '/certificates', label: 'Certificates', icon: '🏆' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ],
  [USER_ROLES.TEACHER]: [
    { path: '/dashboard/teacher', label: 'Dashboard', icon: '🏠' },
    { path: '/my-courses', label: 'My Courses', icon: '📚' },
    { path: '/create-course', label: 'Create Course', icon: '➕' },
    { path: '/students', label: 'Students', icon: '👥' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ],
  [USER_ROLES.ADMIN]: [
    { path: '/dashboard/admin', label: 'Dashboard', icon: '🏠' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/courses', label: 'Courses', icon: '📚' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ],
};

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const items = sidebarItems[user.role] || [];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay d-lg-none" 
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1040
          }}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        style={{
          position: 'fixed',
          top: '70px',
          left: isOpen ? '0' : '-280px',
          width: '280px',
          height: 'calc(100vh - 70px)',
          backgroundColor: '#fff',
          borderRight: '1px solid #e2e8f0',
          transition: 'left 0.3s ease',
          zIndex: 1041,
          overflowY: 'auto',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="sidebar-content p-3">
          <div className="user-info mb-4 p-3 bg-light rounded">
            <h6 className="mb-1">{user.name}</h6>
            <small className="text-muted">{user.email}</small>
            <div className="mt-2">
              <span className={`badge bg-${user.role === USER_ROLES.ADMIN ? 'danger' : user.role === USER_ROLES.TEACHER ? 'primary' : 'success'}`}>
                {user.role}
              </span>
            </div>
          </div>

          <Nav className="flex-column">
            {items.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                onClick={onClose}
                className={`sidebar-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  color: location.pathname === item.path ? '#667eea' : '#4a5568',
                  backgroundColor: location.pathname === item.path ? '#f0f4ff' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span className="sidebar-icon me-3" style={{ fontSize: '18px' }}>
                  {item.icon}
                </span>
                <span className="sidebar-label">{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
