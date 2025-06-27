import { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../utils/constants';
import { getInitials } from '../utils/helpers';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case USER_ROLES.STUDENT:
        return '/dashboard/student';
      case USER_ROLES.TEACHER:
        return '/dashboard/teacher';
      case USER_ROLES.ADMIN:
        return '/dashboard/admin';
      default:
        return '/';
    }
  };

  return (
    <BootstrapNavbar 
      expand="lg" 
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      className="custom-navbar"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        height: '70px',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="brand-logo">
          <span className="brand-text">LearnHub</span>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/browse" onClick={() => setExpanded(false)}>
              Browse Courses
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to={getDashboardLink()} onClick={() => setExpanded(false)}>
                Dashboard
              </Nav.Link>
            )}
          </Nav>
          
          <Nav className="ms-auto align-items-center">
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" className="user-dropdown">
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{getInitials(user.name)}</span>
                    )}
                  </div>
                  <span className="user-name d-none d-md-inline">{user.name}</span>
                  {user.role === USER_ROLES.TEACHER && (
                    <Badge bg="primary" className="ms-2">Teacher</Badge>
                  )}
                  {user.role === USER_ROLES.ADMIN && (
                    <Badge bg="danger" className="ms-2">Admin</Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-courses">
                    My Courses
                  </Dropdown.Item>
                  {user.role === USER_ROLES.TEACHER && (
                    <Dropdown.Item as={Link} to="/create-course">
                      Create Course
                    </Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="auth-buttons">
                <Nav.Link as={Link} to="/login" className="login-link">
                  Login
                </Nav.Link>
                <Link to="/register" className="btn btn-primary register-btn">
                  Get Started
                </Link>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
