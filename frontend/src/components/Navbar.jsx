import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import {
  Compass,
  MapPin,
  Hotel,
  UtensilsCrossed,
  ShoppingBag,
  CalendarCheck2,
  Wrench,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { favoriteKeys } = useFavorites();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navItemClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-box">
            <Compass className="brand-compass-icon" size={26} />
          </div>
          <div className="brand-text">
            <span className="brand-title">TravelMate</span>
            <span className="brand-tagline">Explore · Plan · Experience</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="desktop-navlinks">
          <NavLink to="/" end className={navItemClass}>
            Home
          </NavLink>
          <NavLink to="/explore" className={navItemClass}>
            <MapPin size={15} />
            Explore
          </NavLink>
          <NavLink to="/stays" className={navItemClass}>
            <Hotel size={15} />
            Stays
          </NavLink>
          <NavLink to="/food" className={navItemClass}>
            <UtensilsCrossed size={15} />
            Food
          </NavLink>
          <NavLink to="/markets" className={navItemClass}>
            <ShoppingBag size={15} />
            Markets
          </NavLink>
          <NavLink to="/trips" className={navItemClass}>
            <CalendarCheck2 size={15} />
            My Trips
          </NavLink>
          <NavLink to="/tools" className={navItemClass}>
            <Wrench size={15} />
            Tools
          </NavLink>
        </div>

        {/* Desktop Right Controls (Favorites + Auth) */}
        <div className="desktop-auth-actions">
          {user && (
            <Link to="/favorites" className="nav-favorites-btn" title="Saved Places & Favorites">
              <Heart size={18} className={favoriteKeys.size > 0 ? 'text-rose-filled' : ''} />
              {favoriteKeys.size > 0 && (
                <span className="favorites-badge">{favoriteKeys.size}</span>
              )}
            </Link>
          )}

          {user ? (
            <div className="profile-menu-container">
              <button
                type="button"
                className="profile-pill-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="user-avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name-label">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={`dropdown-chevron ${profileDropdownOpen ? 'rotate' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown-card">
                  <div className="dropdown-user-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  <Link
                    to="/trips"
                    className="dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <CalendarCheck2 size={16} />
                    My Trips
                  </Link>
                  <Link
                    to="/favorites"
                    className="dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <Heart size={16} />
                    Saved Favorites
                  </Link>
                  <hr className="dropdown-divider" />
                  <button type="button" className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="guest-auth-buttons">
              <Link to="/login" className="btn-nav-outline">
                Log In
              </Link>
              <Link to="/register" className="btn-nav-primary">
                Register Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-items">
            <NavLink to="/" end className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/explore" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              <MapPin size={17} />
              Explore Destinations
            </NavLink>
            <NavLink to="/stays" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              <Hotel size={17} />
              Budget Stays
            </NavLink>
            <NavLink to="/food" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              <UtensilsCrossed size={17} />
              Local Food & Dining
            </NavLink>
            <NavLink to="/markets" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              <ShoppingBag size={17} />
              Markets & Shopping
            </NavLink>
            <NavLink to="/trips" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              <CalendarCheck2 size={17} />
              My Trips Planner
            </NavLink>
            <NavLink to="/tools" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              <Wrench size={17} />
              Travel Tools
            </NavLink>
            {user && (
              <>
                <NavLink to="/favorites" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
                  <Heart size={17} />
                  Saved Favorites ({favoriteKeys.size})
                </NavLink>
                <NavLink to="/profile" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
                  <User size={17} />
                  My Profile
                </NavLink>
              </>
            )}
          </div>

          <div className="mobile-auth-footer">
            {user ? (
              <div className="mobile-user-status">
                <div className="mobile-user-info">
                  <div className="user-avatar-circle">{user.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs text-muted">{user.email}</div>
                  </div>
                </div>
                <button type="button" className="btn-nav-outline w-full mt-3" onClick={handleLogout}>
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="mobile-guest-buttons">
                <Link to="/login" className="btn-nav-outline w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link to="/register" className="btn-nav-primary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  Create Free Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
