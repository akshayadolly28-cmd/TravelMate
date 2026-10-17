import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { User, CalendarCheck2, Heart, CheckSquare, LogOut, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { favoriteKeys } = useFavorites();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get('/auth/me')
      .then((res) => setProfileData(res.data))
      .catch((err) => console.error('Failed to load profile data', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initial = profileData?.name ? profileData.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-page-wrapper">
      <div className="page-hero-header">
        <div className="page-header-content">
          <span className="page-header-eyebrow">USER ACCOUNT</span>
          <h1 className="page-header-title">Traveler Profile</h1>
          <p className="page-header-desc">
            Manage your personal travel statistics, active trips, and saved destination favorites.
          </p>
        </div>
      </div>

      <div className="page-main-layout">
        <div className="profile-container-card">
          {/* User Bio Header */}
          <div className="profile-avatar-row">
            <div className="large-avatar-circle">{initial}</div>
            <div className="profile-info-col">
              <h2 className="profile-name-heading">{profileData?.name || 'Traveler'}</h2>
              <div className="profile-email-badge">
                <Mail size={14} className="text-teal" />
                <span>{profileData?.email}</span>
              </div>
              <span className="profile-role-tag">
                <ShieldCheck size={13} /> {profileData?.role || 'USER'} ACCOUNT
              </span>
            </div>

            <button type="button" onClick={handleLogout} className="btn-logout-profile">
              <LogOut size={16} /> Log Out
            </button>
          </div>

          <hr className="my-6 border-slate-200" />

          {/* Quick Statistics Grid */}
          <h3 className="section-subtitle-heading mb-4">Your Travel Activity</h3>
          <div className="profile-stats-three-grid">
            <Link to="/trips" className="profile-stat-box group">
              <div className="stat-icon-wrapper bg-teal-soft">
                <CalendarCheck2 size={24} className="text-teal" />
              </div>
              <div>
                <span className="stat-number">{profileData?.tripsCount || 0}</span>
                <span className="stat-label">Planned Itineraries</span>
              </div>
              <ArrowRight size={16} className="stat-arrow-icon" />
            </Link>

            <Link to="/favorites" className="profile-stat-box group">
              <div className="stat-icon-wrapper bg-rose-soft">
                <Heart size={24} className="text-rose" />
              </div>
              <div>
                <span className="stat-number">{profileData?.favoritesCount || favoriteKeys.size || 0}</span>
                <span className="stat-label">Saved Favorites</span>
              </div>
              <ArrowRight size={16} className="stat-arrow-icon" />
            </Link>

            <Link to="/tools?tab=packing" className="profile-stat-box group">
              <div className="stat-icon-wrapper bg-purple-soft">
                <CheckSquare size={24} className="text-purple" />
              </div>
              <div>
                <span className="stat-number">Active</span>
                <span className="stat-label">Packing Checklist</span>
              </div>
              <ArrowRight size={16} className="stat-arrow-icon" />
            </Link>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Student Evaluation Summary */}
          <div className="project-evaluation-card">
            <h4 className="eval-heading">Academic Project Evaluation Information</h4>
            <div className="eval-info-grid">
              <div>
                <span className="eval-label">Project Name:</span>
                <p className="eval-value">TravelMate – Explore. Plan. Experience.</p>
              </div>
              <div>
                <span className="eval-label">Frontend Architecture:</span>
                <p className="eval-value">React 19 + Vite + React Router DOM + Axios + Lucide Icons</p>
              </div>
              <div>
                <span className="eval-label">Backend Architecture:</span>
                <p className="eval-value">Java 17 + Spring Boot 3 + Spring Security + JWT + JPA</p>
              </div>
              <div>
                <span className="eval-label">Database Management:</span>
                <p className="eval-value">MySQL 9.7 (Database: travelmate)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
