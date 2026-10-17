import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import AddToTripModal from '../components/AddToTripModal';
import PlaceCard from '../components/PlaceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  MapPin,
  Clock,
  Ticket,
  Calendar,
  Lightbulb,
  Heart,
  PlusCircle,
  ExternalLink,
  Star,
  ArrowLeft,
  Share2,
  CheckCircle,
  Compass
} from 'lucide-react';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [place, setPlace] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    setImgError(false);

    API.get(`/places/${id}`)
      .then((res) => {
        setPlace(res.data);
        // Fetch nearby places in the same city
        if (res.data?.cityId) {
          API.get(`/places/city/${res.data.cityId}`)
            .then((nearbyRes) => {
              if (Array.isArray(nearbyRes.data)) {
                setNearbyPlaces(nearbyRes.data.filter((p) => p.id !== res.data.id).slice(0, 3));
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error('Failed to load place details', err);
        setError('Destination not found or server error.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading destination details..." />;
  }

  if (error || !place) {
    return (
      <div className="section-container text-center py-16">
        <ErrorMessage message={error || 'Destination not found.'} onRetry={() => window.location.reload()} />
        <Link to="/explore" className="btn-nav-outline mt-6 inline-flex">
          <ArrowLeft size={16} /> Back to Explore
        </Link>
      </div>
    );
  }

  const favorited = isFavorite('PLACE', place.id);

  const handleFavoriteToggle = async () => {
    await toggleFavorite({
      itemType: 'PLACE',
      id: place.id,
      name: place.name,
      description: place.description,
      imageUrl: place.imageUrl,
      rating: place.rating,
      entryFee: place.entryFee,
      cityName: place.cityName
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: `Check out ${place.name} on TravelMate!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="place-details-page">
      {/* Top Breadcrumb & Back Bar */}
      <div className="details-top-bar">
        <div className="details-container flex justify-between items-center">
          <button type="button" onClick={() => navigate(-1)} className="btn-back-link">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="details-breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/explore">Explore</Link>
            <span>/</span>
            <span className="text-navy font-semibold">{place.name}</span>
          </div>
        </div>
      </div>

      <div className="details-container">
        {/* Hero Media Section */}
        <div className="details-hero-card">
          <div className="details-hero-image-wrapper">
            <img
              src={!imgError && place.imageUrl ? place.imageUrl : fallbackImage}
              alt={place.name}
              className="details-hero-img"
              onError={() => setImgError(true)}
            />
            <div className="details-hero-overlay" />

            <div className="details-hero-floating-info">
              <div className="flex gap-2 items-center flex-wrap mb-2">
                <span className="category-pill badge-teal">{place.category || 'Sightseeing'}</span>
                {place.cityName && (
                  <span className="location-pill-white">
                    <MapPin size={13} /> {place.cityName}
                  </span>
                )}
              </div>
              <h1 className="details-hero-title">{place.name}</h1>
            </div>
          </div>
        </div>

        {/* Action Header Bar */}
        <div className="details-action-bar">
          <div className="details-rating-block">
            <div className="rating-pill large">
              <Star size={16} className="star-icon" />
              <span className="font-bold">{place.rating ? place.rating.toFixed(1) : '4.6'}</span>
            </div>
            <span className="text-muted text-sm">
              Based on {place.reviewCount || 180} verified traveler reviews
            </span>
          </div>

          <div className="details-cta-buttons">
            <button
              type="button"
              onClick={handleFavoriteToggle}
              className={`btn-details-action ${favorited ? 'is-fav' : ''}`}
            >
              <Heart size={18} fill={favorited ? '#ef4444' : 'none'} color={favorited ? '#ef4444' : 'currentColor'} />
              <span>{favorited ? 'Saved to Favorites' : 'Save to Favorites'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-details-primary"
            >
              <PlusCircle size={18} />
              <span>Add to My Trip</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="btn-details-action"
              title="Share destination"
            >
              <Share2 size={16} />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Two-Column Details Body */}
        <div className="details-body-grid">
          {/* Main Info Column */}
          <div className="details-main-col">
            <div className="details-section-box">
              <h2 className="details-box-heading">About This Destination</h2>
              <p className="details-text-paragraph">{place.description}</p>
            </div>

            {/* Travel Tips Box */}
            <div className="details-section-box tips-box">
              <div className="tips-box-header">
                <Lightbulb size={22} className="text-amber" />
                <h3 className="tips-box-title">Insider Travel Tips</h3>
              </div>
              <p className="tips-box-text">
                {place.travelTips ||
                  'Visit early morning or late afternoon to experience fewer crowds and optimal lighting for photography. Wear comfortable walking shoes.'}
              </p>
            </div>

            {/* Interactive Map & Directions Link */}
            <div className="details-section-box">
              <h2 className="details-box-heading">Location & Directions</h2>
              <p className="details-text-muted mb-4">
                <MapPin size={16} className="inline text-teal mr-1" />
                {place.address || `${place.name}, ${place.cityName || 'City Center'}, India`}
              </p>

              <div className="details-map-banner">
                <div className="map-banner-info">
                  <h4>Navigate with Google Maps</h4>
                  <p>Get real-time directions, traffic estimates, and transit routes.</p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    place.name + ' ' + (place.cityName || '')
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-open-maps"
                >
                  Open in Maps <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar / Quick Facts Box */}
          <div className="details-sidebar-col">
            <div className="quick-facts-card">
              <h3 className="quick-facts-title">Destination Facts</h3>

              <div className="fact-item">
                <div className="fact-icon-box bg-teal-soft">
                  <Ticket size={18} className="text-teal" />
                </div>
                <div>
                  <span className="fact-label">Entry Fee</span>
                  <p className="fact-value">
                    {place.entryFee && place.entryFee > 0 ? `₹${Math.round(place.entryFee)} per person` : 'Free Entry'}
                  </p>
                </div>
              </div>

              <div className="fact-item">
                <div className="fact-icon-box bg-blue-soft">
                  <Clock size={18} className="text-blue" />
                </div>
                <div>
                  <span className="fact-label">Visiting Hours</span>
                  <p className="fact-value">
                    {place.openingTime || '09:00'} - {place.closingTime || '18:00'}
                  </p>
                </div>
              </div>

              <div className="fact-item">
                <div className="fact-icon-box bg-amber-soft">
                  <Calendar size={18} className="text-amber" />
                </div>
                <div>
                  <span className="fact-label">Best Time to Visit</span>
                  <p className="fact-value">{place.bestTimeToVisit || 'October to March (Pleasant weather)'}</p>
                </div>
              </div>

              <div className="fact-item">
                <div className="fact-icon-box bg-purple-soft">
                  <Compass size={18} className="text-purple" />
                </div>
                <div>
                  <span className="fact-label">Estimated Visit Duration</span>
                  <p className="fact-value">{place.estimatedDuration || '2 - 3 hours'}</p>
                </div>
              </div>

              <hr className="my-4 border-slate-200" />

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn-plan-trip-sidebar"
              >
                <PlusCircle size={16} />
                Plan This Into Your Trip
              </button>
            </div>
          </div>
        </div>

        {/* Nearby Attractions */}
        {nearbyPlaces.length > 0 && (
          <div className="nearby-places-section">
            <div className="section-header-row">
              <div>
                <span className="section-eyebrow">EXPLORE MORE</span>
                <h2 className="section-title">Nearby in {place.cityName}</h2>
              </div>
            </div>

            <div className="cards-grid-3">
              {nearbyPlaces.map((np) => (
                <PlaceCard key={np.id} place={np} onAddToTrip={() => setIsModalOpen(true)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add To Trip Modal */}
      <AddToTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={place}
        itemType="PLACE"
      />
    </div>
  );
}
