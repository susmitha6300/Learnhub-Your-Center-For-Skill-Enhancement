import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function AuthForm({ type, onSubmit, loading = false, disabled = false }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disabled && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {type === 'register' && (
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="modern-input"
            disabled={disabled}
            required
          />
        </Form.Group>
      )}
      
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="modern-input"
          disabled={disabled}
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <div className="password-input-wrapper">
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="modern-input password-input"
            disabled={disabled}
            required
          />
          <Button
            variant="link"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            disabled={disabled}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </div>
      </Form.Group>
      
      {type === 'register' && (
        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="modern-input"
            disabled={disabled}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </Form.Select>
        </Form.Group>
      )}
      
      <Button 
        type="submit" 
        className={`${type === 'login' ? 'login-btn' : 'register-btn'} w-100`}
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" />
            {type === 'login' ? 'Signing In...' : 'Creating Account...'}
          </>
        ) : (
          type === 'login' ? 'Sign In' : 'Create Account'
        )}
      </Button>
    </Form>
  );
}

export default AuthForm;
