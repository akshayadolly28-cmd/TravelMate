import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { MapPin, Star, Heart, ExternalLink, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function StayCard({ stay, onAddToTrip }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const [savingFav, setSavingFav] = useState(false);

  const favorited = isFavorite('STAY', stay.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSavingFav(true);
    await toggleFavorite({
      itemType: 'STAY',
      id: stay.id,
      name: stay.name,
      description: stay.description,
      imageUrl: stay.imageUrl,
      rating: stay.rating,
      pricePerNight: stay.pricePerNight,
      cityName: stay.cityName
    });
    setSavingFav(false);
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  const typePillClass = () => {
    switch (stay.type?.toUpperCase()) {
      case 'HOSTEL':
        return 'badge-teal';
      case 'HOMESTAY':
        return 'badge-amber';
      case 'GUESTHOUSE':
        return 'badge-purple';
      default:
        return 'badge-blue';
    }
  };

  const amenitiesList = stay.amenities ? stay.amenities.split(',').slice(0, 3) : ['Free Wi-Fi', 'Air Conditioned'];

  return (
    <div className="travel-card stay-card group">
      <div className="card-media-wrapper">
        <img
          src={!imgError && stay.imageUrl ? stay.imageUrl : fallbackImage}
          alt={stay.name}
          className="card-media-img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="card-media-overlay" />

        <div className="card-badge-top-left">
          <span className={`category-pill ${typePillClass()}`}>
            {stay.type || 'Stay'}
          </span>
          {stay.isBudgetFriendly && (
            <span className="badge-budget-tag">Budget Deal</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={savingFav}
          className={`card-favorite-btn ${favorited ? 'is-favorited' : ''}`}
          title={favorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={18} fill={favorited ? '#ef4444' : 'none'} color={favorited ? '#ef4444' : '#ffffff'} />
        </button>

        {stay.cityName && (
          <div className="card-city-tag">
            <MapPin size={13} />
            <span>{stay.cityName}</span>
          </div>
        )}
      </div>

      <div className="card-content-body">
        <div className="card-rating-row">
          <div className="rating-pill">
            <Star size={13} className="star-icon" />
            <span className="font-bold">{stay.rating ? stay.rating.toFixed(1) : '4.5'}</span>
            <span className="review-count">({stay.reviewCount || 90})</span>
          </div>

          <div className="price-tag-highlight">
            <span className="price-number">₹{Math.round(stay.pricePerNight || 999)}</span>
            <span className="price-unit">/ night</span>
          </div>
        </div>

        <h3 className="card-title stay-title">{stay.name}</h3>

        <p className="card-description">
          {stay.description || 'Comfortable stay with verified amenities and convenient location.'}
        </p>

        {/* Amenities preview */}
        <div className="stay-amenities-tags">
          {amenitiesList.map((am, i) => (
            <span key={i} className="amenity-chip">
              <CheckCircle2 size={11} className="text-teal" />
              {am.trim()}
            </span>
          ))}
        </div>

        <div className="card-actions-row">
          <a
            href={stay.bookingUrl || `https://www.google.com/search?q=${encodeURIComponent(stay.name + ' hotel booking')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-booking-provider"
            title="Search booking options on external provider"
          >
            Check Provider Rates
            <ExternalLink size={14} />
          </a>

          {onAddToTrip && (
            <button
              type="button"
              className="btn-add-trip-icon"
              onClick={() => onAddToTrip(stay, 'STAY')}
              title="Add Stay to Itinerary"
            >
              <PlusCircle size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
