import { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../hooks/useAuth';
import { FaGoogle, FaGithub } from 'react-icons/fa';

function Login() {
  const { login, loading, error, isAuthenticated, user } = useAuth();
  const [loginError, setLoginError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Get the intended destination from location state
  const from = location.state?.from || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = user.role === 'admin' 
        ? '/dashboard/admin' 
        : user.role === 'teacher' 
          ? '/dashboard/teacher' 
          : '/dashboard/student';
      
      navigate(from === '/' ? dashboardRoute : from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleLogin = async (formData) => {
    setLoginError('');
    
    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (!result.success) {
        setLoginError(result.error || 'Login failed');
      }
      // Success case is handled by useAuth hook (auto-redirect)
    } catch (err) {
      setLoginError(err.message || 'An unexpected error occurred');
    }
  };

  const handleSocialLogin = (provider) => {
    // TODO: Implement social login
    console.log(`Login with ${provider} - Coming soon!`);
    setLoginError(`${provider} login is not yet implemented`);
  };

  // Show loading skeleton while checking authentication
  if (loading && !loginError) {
    return (
      <div className="login-page">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={4}>
              <LoadingSkeleton type="card" />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="login-page">
      <Container fluid className="login-container">
        <Row className="min-vh-100 align-items-center justify-content-center">
          <Col lg={10} xl={8}>
            <Row className="login-card-wrapper">
              {/* Left Side - Branding */}
              <Col lg={6} className="login-brand-side">
                <div className="brand-content">
                  <div className="brand-logo">
                    <h1>LearnHub</h1>
                  </div>
                  <h2>Welcome Back!</h2>
                  <p>Continue your learning journey with thousands of courses and expert instructors.</p>
                  
                  <div className="feature-highlights">
                    <div className="feature-item">
                      <span className="feature-icon">🎓</span>
                      <span>Expert-led courses</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📱</span>
                      <span>Learn anywhere, anytime</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🏆</span>
                      <span>Get certified</span>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Right Side - Login Form */}
              <Col lg={6} className="login-form-side">
                <div className="login-form-card">
                  <div className="text-center mb-4">
                    <h3 className="login-title">Sign In</h3>
                    <p className="login-subtitle">Enter your credentials to access your account</p>
                  </div>

                  {/* Error Alert */}
                  {(loginError || error) && (
                    <Alert variant="danger" className="mb-4">
                      {loginError || error}
                    </Alert>
                  )}

                  {/* Return URL Info */}
                  {from !== '/' && (
                    <Alert variant="info" className="mb-4">
                      Please log in to access {from}
                    </Alert>
                  )}

                  {/* Social Login Buttons */}
                  <div className="social-login-section mb-4">
                    <button 
                      className="btn btn-outline-secondary social-btn google-btn w-100 mb-2"
                      onClick={() => handleSocialLogin('Google')}
                      disabled={loading}
                    >
                      <FaGoogle className="me-2" />
                      Continue with Google
                    </button>
                    <button 
                      className="btn btn-outline-secondary social-btn github-btn w-100"
                      onClick={() => handleSocialLogin('GitHub')}
                      disabled={loading}
                    >
                      <FaGithub className="me-2" />
                      Continue with GitHub
                    </button>
                  </div>

                  <div className="divider">
                    <span>or</span>
                  </div>

                  {/* Login Form */}
                  <AuthForm 
                    type="login" 
                    onSubmit={handleLogin}
                    loading={loading}
                    disabled={loading}
                  />

                  <div className="signup-link text-center mt-4">
                    <p>
                      Don't have an account?{' '}
                      <Link to="/register" state={{ from }}>
                        Create one here
                      </Link>
                    </p>
                  </div>

                  {/* Demo Accounts Info */}
                  <div className="demo-accounts mt-4 p-3 bg-light rounded">
                    <small className="text-muted">
                      <strong>Demo Accounts:</strong><br />
                      Student: student@demo.com / password123<br />
                      Teacher: teacher@demo.com / password123<br />
                      Admin: admin@demo.com / password123
                    </small>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
