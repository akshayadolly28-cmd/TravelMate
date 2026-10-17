import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Compass, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill out all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      if (res.data?.token && res.data?.user) {
        login(res.data.user, res.data.token);
        navigate('/explore', { replace: true });
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email might already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box">
        <div className="auth-header text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="brand-icon-box">
              <Compass size={24} className="brand-compass-icon" />
            </div>
            <span className="brand-title">TravelMate</span>
          </Link>
          <h2 className="auth-title">Create Free Account</h2>
          <p className="auth-subtitle">Join thousands of travelers planning unforgettable adventures.</p>
        </div>

        {error && (
          <div className="form-error-alert flex items-center gap-2 mt-4">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form mt-6">
          <div className="form-group">
            <label htmlFor="reg-name">Full Name:</label>
            <input
              id="reg-name"
              type="text"
              placeholder="e.g. Akshaya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address:</label>
            <input
              id="reg-email"
              type="email"
              placeholder="e.g. akshaya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password (min. 6 characters):</label>
            <div className="password-input-relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input-control"
                required
              />
              <button
                type="button"
                className="btn-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-auth-submit mt-4"
          >
            {submitting ? 'Creating Account...' : 'Get Started for Free'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer text-center mt-6">
          <p className="text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-teal font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
