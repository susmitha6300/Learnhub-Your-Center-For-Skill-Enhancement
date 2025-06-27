import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaGoogle, FaGithub, FaUser, FaChalkboardTeacher } from 'react-icons/fa';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Register attempt:', formData);
      setIsLoading(false);
      // navigate('/dashboard/student') // Uncomment when backend is ready
    }, 1500);
  };

  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider}`);
  };

  return (
    <div className="register-page">
      <Container fluid className="register-container">
        <Row className="min-vh-100 align-items-center justify-content-center">
          <Col lg={10} xl={8}>
            <Row className="register-card-wrapper">
              {/* Left Side - Branding */}
              <Col lg={6} className="register-brand-side">
                <div className="brand-content">
                  <div className="brand-logo">
                    <h1>Join LearnHub</h1>
                  </div>
                  <h2>Start Your Learning Journey!</h2>
                  <p>Join thousands of learners and instructors in our growing community.</p>
                  
                  <div className="feature-highlights">
                    <div className="feature-item">
                      <span className="feature-icon">🚀</span>
                      <span>Learn from industry experts</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">💡</span>
                      <span>Build real-world projects</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🏆</span>
                      <span>Earn verified certificates</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">👥</span>
                      <span>Connect with peers globally</span>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Right Side - Register Form */}
              <Col lg={6} className="register-form-side">
                <Card className="register-form-card">
                  <Card.Body className="p-5">
                    <div className="text-center mb-4">
                      <h3 className="register-title">Create Account</h3>
                      <p className="register-subtitle">Choose your role and get started</p>
                    </div>

                    {error && (
                      <Alert variant="danger" className="mb-4">
                        {error}
                      </Alert>
                    )}

                    {/* Role Selection */}
                    <div className="role-selection mb-4">
                      <p className="role-label mb-3">I want to:</p>
                      <div className="role-options">
                        <div 
                          className={`role-option ${formData.role === 'student' ? 'active' : ''}`}
                          onClick={() => setFormData({...formData, role: 'student'})}
                        >
                          <FaUser className="role-icon" />
                          <div>
                            <h6>Learn</h6>
                            <small>Take courses and earn certificates</small>
                          </div>
                        </div>
                        <div 
                          className={`role-option ${formData.role === 'teacher' ? 'active' : ''}`}
                          onClick={() => setFormData({...formData, role: 'teacher'})}
                        >
                          <FaChalkboardTeacher className="role-icon" />
                          <div>
                            <h6>Teach</h6>
                            <small>Create courses and share knowledge</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Registration */}
                    <div className="social-register-section mb-4">
                      <Button 
                        variant="outline-secondary" 
                        className="social-btn google-btn"
                        onClick={() => handleSocialRegister('Google')}
                      >
                        <FaGoogle className="me-2" />
                        Continue with Google
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        className="social-btn github-btn"
                        onClick={() => handleSocialRegister('GitHub')}
                      >
                        <FaGithub className="me-2" />
                        Continue with GitHub
                      </Button>
                    </div>

                    <div className="divider">
                      <span>or</span>
                    </div>

                    {/* Registration Form */}
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="modern-input"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className="modern-input"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a password"
                          className="modern-input"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          className="modern-input"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Check
                          type="checkbox"
                          label={
                            <span>
                              I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                              <Link to="/privacy">Privacy Policy</Link>
                            </span>
                          }
                          required
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        className="register-btn"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </Form>

                    <div className="login-link">
                      <p>Already have an account? <Link to="/login">Sign in here</Link></p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }
        
        .role-selection {
          margin-bottom: 2rem;
        }
        
        .role-label {
          font-weight: 600;
          color: #4a5568;
        }
        
        .role-options {
          display: flex;
          gap: 1rem;
        }
        
        .role-option {
          flex: 1;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .role-option:hover {
          border-color: #667eea;
          background: #f0f4ff;
        }
        
        .role-option.active {
          border-color: #667eea;
          background: #f0f4ff;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .role-icon {
          font-size: 1.5rem;
          color: #667eea;
        }
        
        .role-option h6 {
          margin: 0;
          font-weight: 600;
          color: #2d3748;
        }
        
        .role-option small {
          color: #718096;
        }
      `}</style>
    </div>
  );
}

export default Register;
