import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { MapPin, Star, Heart, Clock, ShoppingBag, ExternalLink, PlusCircle } from 'lucide-react';

export default function MarketCard({ market, onAddToTrip }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const [savingFav, setSavingFav] = useState(false);

  const favorited = isFavorite('MARKET', market.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSavingFav(true);
    await toggleFavorite({
      itemType: 'MARKET',
      id: market.id,
      name: market.name,
      description: market.description,
      imageUrl: market.imageUrl,
      rating: market.rating,
      priceInfo: market.priceLevel,
      cityName: market.cityName
    });
    setSavingFav(false);
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80';

  const categoryName = (market.category || 'LOCAL_BAZAARS').replace('_', ' ');

  return (
    <div className="travel-card market-card group">
      <div className="card-media-wrapper">
        <img
          src={!imgError && market.imageUrl ? market.imageUrl : fallbackImage}
          alt={market.name}
          className="card-media-img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="card-media-overlay" />

        <div className="card-badge-top-left">
          <span className="category-pill badge-purple">
            {categoryName}
          </span>
          <span className="badge-price-level">
            {market.priceLevel || 'BUDGET'}
          </span>
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

        {market.cityName && (
          <div className="card-city-tag">
            <MapPin size={13} />
            <span>{market.cityName}</span>
          </div>
        )}
      </div>

      <div className="card-content-body">
        <div className="card-rating-row">
          <div className="rating-pill">
            <Star size={13} className="star-icon" />
            <span className="font-bold">{market.rating ? market.rating.toFixed(1) : '4.6'}</span>
            <span className="review-count">({market.reviewCount || 160})</span>
          </div>

          <div className="market-hours-pill">
            <Clock size={12} />
            <span>{market.openingTime || '10:00'} - {market.closingTime || '22:00'}</span>
          </div>
        </div>

        <h3 className="card-title">{market.name}</h3>

        {/* Famous For Banner */}
        {market.famousFor && (
          <div className="famous-for-box">
            <ShoppingBag size={13} className="bag-icon" />
            <div>
              <span className="famous-label">Famous for: </span>
              <span className="famous-value">{market.famousFor}</span>
            </div>
          </div>
        )}

        <p className="card-description">
          {market.description || 'Bustling local bazaar and street shopping center.'}
        </p>

        <div className="card-actions-row">
          <a
            href={market.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(market.name + ' ' + (market.cityName || ''))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view-details"
          >
            <MapPin size={14} />
            View on Map
            <ExternalLink size={12} />
          </a>

          {onAddToTrip && (
            <button
              type="button"
              className="btn-add-trip-icon"
              onClick={() => onAddToTrip(market, 'MARKET')}
              title="Add Market to Itinerary"
            >
              <PlusCircle size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
