import { Link } from 'react-router-dom';
import { Compass, Home, MapPin, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-card text-center">
        <div className="not-found-icon-box">
          <Compass size={64} className="text-teal animate-spin-slow" />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Off the Beaten Path</h2>
        <p className="not-found-desc">
          The page or travel destination you are looking for doesn't exist or has moved to a new route.
        </p>

        <div className="flex gap-4 justify-center mt-6">
          <Link to="/" className="btn-primary-sm">
            <Home size={16} /> Return Home
          </Link>
          <Link to="/explore" className="btn-nav-outline text-sm">
            <MapPin size={16} /> Explore Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}
