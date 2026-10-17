import { Link } from 'react-router-dom';
import { Compass, MapPin, Heart, Shield, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Col 1: Brand & Mission */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <div className="brand-icon-box">
              <Compass size={22} className="brand-compass-icon" />
            </div>
            <span className="brand-title">TravelMate</span>
          </div>
          <p className="footer-tagline">
            Explore. Plan. Experience.
          </p>
          <p className="footer-description">
            A comprehensive travel discovery and smart trip-planning platform. Designed for Indian travelers and international tourists seeking budget stays, authentic food, and unforgettable adventures.
          </p>
          <div className="footer-meta-pill">
            <Sparkles size={14} className="text-teal" />
            <span>Built with Spring Boot 3 + React + MySQL</span>
          </div>
        </div>

        {/* Col 2: Featured Cities */}
        <div className="footer-col">
          <h4 className="footer-heading">Top Destinations</h4>
          <ul className="footer-links">
            <li>
              <Link to="/explore?city=Hyderabad">Hyderabad · City of Pearls</Link>
            </li>
            <li>
              <Link to="/explore?city=Goa">Goa · Coastal Paradise</Link>
            </li>
            <li>
              <Link to="/explore?city=Mumbai">Mumbai · City of Dreams</Link>
            </li>
            <li>
              <Link to="/explore?city=Jaipur">Jaipur · The Pink City</Link>
            </li>
            <li>
              <Link to="/explore">View All Destinations →</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Discovery Modules */}
        <div className="footer-col">
          <h4 className="footer-heading">Explore Platform</h4>
          <ul className="footer-links">
            <li>
              <Link to="/explore">Tourist Attractions</Link>
            </li>
            <li>
              <Link to="/stays">Budget-Friendly Stays</Link>
            </li>
            <li>
              <Link to="/food">Local Street Food</Link>
            </li>
            <li>
              <Link to="/markets">Bazaars & Shopping</Link>
            </li>
            <li>
              <Link to="/trips">Day-by-Day Trip Planner</Link>
            </li>
            <li>
              <Link to="/favorites">Saved Favorites</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Travel Tools & Student Info */}
        <div className="footer-col">
          <h4 className="footer-heading">Travel Tools</h4>
          <ul className="footer-links">
            <li>
              <Link to="/tools?tab=currency">Currency Converter</Link>
            </li>
            <li>
              <Link to="/tools?tab=budget">Trip Budget Calculator</Link>
            </li>
            <li>
              <Link to="/tools?tab=packing">Packing Checklist</Link>
            </li>
            <li>
              <Link to="/tools?tab=weather">Weather Forecasts</Link>
            </li>
            <li>
              <Link to="/tools?tab=safety">Tourist Safety Guide</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <p>© {new Date().getFullYear()} TravelMate · Smart Tourist Information and Travel Planning Platform.</p>
          <div className="footer-bottom-notes">
            <span>B.Tech CSE Capstone Project</span>
            <span>·</span>
            <span>Local Server: localhost:8080</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
