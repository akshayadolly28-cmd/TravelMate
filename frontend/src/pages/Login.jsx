import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Compass, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/explore';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password
      });

      if (res.data?.token && res.data?.user) {
        login(res.data.user, res.data.token);
        navigate(redirectPath, { replace: true });
      } else {
        setError(res.data?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
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
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Log in to manage your itineraries, saved places, and packing lists.</p>
        </div>

        {error && (
          <div className="form-error-alert flex items-center gap-2 mt-4">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form mt-6">
          <div className="form-group">
            <label htmlFor="login-email">Email Address:</label>
            <input
              id="login-email"
              type="email"
              placeholder="e.g. traveler@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password:</label>
            <div className="password-input-relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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
            {submitting ? 'Logging in...' : 'Sign In to TravelMate'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer text-center mt-6">
          <p className="text-sm text-muted">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-teal font-semibold hover:underline">
              Register for Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
