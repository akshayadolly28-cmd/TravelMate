import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { MapPin, Star, Heart, Clock, Utensils, Sparkles, PlusCircle } from 'lucide-react';

export default function FoodCard({ food, onAddToTrip }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const [savingFav, setSavingFav] = useState(false);

  const favorited = isFavorite('FOOD', food.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSavingFav(true);
    await toggleFavorite({
      itemType: 'FOOD',
      id: food.id,
      name: food.name,
      description: food.description,
      imageUrl: food.imageUrl,
      rating: food.rating,
      indicativePrice: food.indicativePrice,
      cityName: food.cityName
    });
    setSavingFav(false);
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';

  const isVeg = food.foodType?.toUpperCase() === 'VEG';
  const isNonVeg = food.foodType?.toUpperCase() === 'NON_VEG';

  return (
    <div className="travel-card food-card group">
      <div className="card-media-wrapper">
        <img
          src={!imgError && food.imageUrl ? food.imageUrl : fallbackImage}
          alt={food.name}
          className="card-media-img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="card-media-overlay" />

        <div className="card-badge-top-left">
          {/* Veg / Non-veg dot */}
          <span className={`diet-badge ${isVeg ? 'is-veg' : isNonVeg ? 'is-non-veg' : 'is-both'}`}>
            <span className="diet-dot" />
            {isVeg ? 'Pure Veg' : isNonVeg ? 'Non-Veg' : 'Veg & Non-Veg'}
          </span>
          <span className="category-pill badge-neutral">
            {food.category ? food.category.replace('_', ' ') : 'Dine & Street'}
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

        {food.cityName && (
          <div className="card-city-tag">
            <MapPin size={13} />
            <span>{food.cityName}</span>
          </div>
        )}
      </div>

      <div className="card-content-body">
        <div className="card-rating-row">
          <div className="rating-pill">
            <Star size={13} className="star-icon" />
            <span className="font-bold">{food.rating ? food.rating.toFixed(1) : '4.6'}</span>
            <span className="review-count">({food.reviewCount || 150})</span>
          </div>

          <div className="food-price-badge">
            <span className="price-symbol">{food.priceRange || '₹₹'}</span>
            <span className="price-approx">· ₹{Math.round(food.indicativePrice || 120)} approx</span>
          </div>
        </div>

        <h3 className="card-title">{food.name}</h3>

        {/* Must Try Dish Banner */}
        {food.mustTryDish && (
          <div className="must-try-box">
            <Sparkles size={13} className="sparkle-icon" />
            <div>
              <span className="must-try-label">Must Try: </span>
              <span className="must-try-dish">{food.mustTryDish}</span>
            </div>
          </div>
        )}

        <p className="card-description">
          {food.description || 'Authentic regional culinary stop famous for local flavors.'}
        </p>

        {food.openingHours && (
          <div className="card-extra-meta">
            <Clock size={13} />
            <span>Hours: {food.openingHours}</span>
          </div>
        )}

        <div className="card-actions-row">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.name + ' ' + (food.cityName || ''))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view-details"
          >
            <MapPin size={14} />
            Directions & Maps
          </a>

          {onAddToTrip && (
            <button
              type="button"
              className="btn-add-trip-icon"
              onClick={() => onAddToTrip(food, 'FOOD')}
              title="Add Food Stop to Itinerary"
            >
              <PlusCircle size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
