import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { MapPin, Star, Clock, Ticket, Heart, PlusCircle } from 'lucide-react';

export default function PlaceCard({ place, onAddToTrip }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const [savingFav, setSavingFav] = useState(false);

  const favorited = isFavorite('PLACE', place.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSavingFav(true);
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
    setSavingFav(false);
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';

  const categoryColorClass = () => {
    switch (place.category?.toUpperCase()) {
      case 'BEACHES':
        return 'badge-blue';
      case 'HISTORICAL':
        return 'badge-amber';
      case 'NATURE':
        return 'badge-emerald';
      case 'ADVENTURE':
        return 'badge-orange';
      case 'RELIGIOUS':
        return 'badge-purple';
      default:
        return 'badge-teal';
    }
  };

  return (
    <div className="travel-card place-card group">
      {/* Image & Badges */}
      <div className="card-media-wrapper">
        <img
          src={!imgError && place.imageUrl ? place.imageUrl : fallbackImage}
          alt={place.name}
          className="card-media-img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="card-media-overlay" />

        {/* Top Badges */}
        <div className="card-badge-top-left">
          <span className={`category-pill ${categoryColorClass()}`}>
            {place.category || 'Sightseeing'}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={savingFav}
          className={`card-favorite-btn ${favorited ? 'is-favorited' : ''}`}
          title={favorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={18} fill={favorited ? '#ef4444' : 'none'} color={favorited ? '#ef4444' : '#ffffff'} />
        </button>

        {/* Bottom City Tag */}
        {place.cityName && (
          <div className="card-city-tag">
            <MapPin size={13} />
            <span>{place.cityName}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="card-content-body">
        <div className="card-rating-row">
          <div className="rating-pill">
            <Star size={13} className="star-icon" />
            <span className="font-bold">{place.rating ? place.rating.toFixed(1) : '4.5'}</span>
            <span className="review-count">({place.reviewCount || 120})</span>
          </div>
          <div className="fee-badge">
            <Ticket size={13} />
            <span>{place.entryFee && place.entryFee > 0 ? `₹${Math.round(place.entryFee)}` : 'Free Entry'}</span>
          </div>
        </div>

        <h3 className="card-title">
          <Link to={`/places/${place.id}`}>{place.name}</Link>
        </h3>

        <p className="card-description">
          {place.description || 'Explore this iconic travel destination.'}
        </p>

        {place.estimatedDuration && (
          <div className="card-extra-meta">
            <Clock size={13} />
            <span>Visit duration: {place.estimatedDuration}</span>
          </div>
        )}

        {/* Card Actions */}
        <div className="card-actions-row">
          <Link to={`/places/${place.id}`} className="btn-view-details">
            Explore Details →
          </Link>

          {onAddToTrip && (
            <button
              type="button"
              className="btn-add-trip-icon"
              onClick={() => onAddToTrip(place, 'PLACE')}
              title="Add to Itinerary"
            >
              <PlusCircle size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
