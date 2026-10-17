import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { Heart, Trash2, MapPin, Star, ExternalLink, Compass, Hotel, UtensilsCrossed, ShoppingBag } from 'lucide-react';

export default function Favorites() {
  const { favoritesList, removeFavorite, loading } = useFavorites();
  const [selectedType, setSelectedType] = useState('ALL');

  const filtered =
    selectedType === 'ALL'
      ? favoritesList
      : favoritesList.filter((f) => (f.itemType || '').toUpperCase() === selectedType);

  const filterTabs = [
    { id: 'ALL', label: 'All Saved', count: favoritesList.length },
    { id: 'PLACE', label: 'Places', count: favoritesList.filter((f) => f.itemType === 'PLACE').length },
    { id: 'STAY', label: 'Stays', count: favoritesList.filter((f) => f.itemType === 'STAY').length },
    { id: 'FOOD', label: 'Food Spots', count: favoritesList.filter((f) => f.itemType === 'FOOD').length },
    { id: 'MARKET', label: 'Markets', count: favoritesList.filter((f) => f.itemType === 'MARKET').length }
  ];

  const getTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'STAY':
        return <Hotel size={14} className="text-amber" />;
      case 'FOOD':
        return <UtensilsCrossed size={14} className="text-rose" />;
      case 'MARKET':
        return <ShoppingBag size={14} className="text-purple" />;
      default:
        return <Compass size={14} className="text-teal" />;
    }
  };

  const getItemLink = (fav) => {
    if (fav.itemType === 'PLACE') return `/places/${fav.itemId || fav.placeId}`;
    if (fav.itemType === 'STAY') return `/stays`;
    if (fav.itemType === 'FOOD') return `/food`;
    if (fav.itemType === 'MARKET') return `/markets`;
    return '/explore';
  };

  return (
    <div className="favorites-page-wrapper">
      <div className="page-hero-header">
        <div className="page-header-content">
          <span className="page-header-eyebrow">SAVED EXPERIENCES</span>
          <h1 className="page-header-title">My Saved Favorites</h1>
          <p className="page-header-desc">
            Quickly access your saved attractions, budget accommodations, street food spots, and local shopping bazaars.
          </p>
        </div>
      </div>

      <div className="page-main-layout">
        {/* Filter Tabs Bar */}
        <div className="filter-controls-card py-3">
          <div className="category-chips-scroll">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-chip ${selectedType === tab.id ? 'active' : ''}`}
                onClick={() => setSelectedType(tab.id)}
              >
                <span>{tab.label}</span>
                <span className="chip-counter">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-center py-12 text-muted">Loading your saved items...</p>
        ) : filtered.length === 0 ? (
          <div className="empty-trips-card text-center py-16">
            <Heart size={48} className="text-slate-300 mx-auto mb-3" />
            <h3 className="empty-title">No saved items in this category</h3>
            <p className="empty-subtitle">
              Browse destinations, stays, and food to click the heart icon and save them here!
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <Link to="/explore" className="btn-primary-sm">
                Explore Destinations
              </Link>
              <Link to="/stays" className="btn-nav-outline text-sm">
                Browse Stays
              </Link>
            </div>
          </div>
        ) : (
          <div className="cards-grid-3 mt-6">
            {filtered.map((fav) => (
              <div key={fav.id} className="travel-card favorite-card group">
                <div className="card-media-wrapper">
                  <img
                    src={fav.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'}
                    alt={fav.title}
                    className="card-media-img"
                    loading="lazy"
                  />
                  <div className="card-media-overlay" />

                  <div className="card-badge-top-left">
                    <span className="category-pill badge-neutral flex items-center gap-1">
                      {getTypeIcon(fav.itemType)}
                      <span>{fav.itemType || 'PLACE'}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFavorite(fav.id, fav.itemType, fav.itemId)}
                    className="card-favorite-btn is-favorited"
                    title="Remove from favorites"
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>

                  {fav.cityName && (
                    <div className="card-city-tag">
                      <MapPin size={13} />
                      <span>{fav.cityName}</span>
                    </div>
                  )}
                </div>

                <div className="card-content-body">
                  <div className="card-rating-row">
                    {fav.rating ? (
                      <div className="rating-pill">
                        <Star size={13} className="star-icon" />
                        <span className="font-bold">{fav.rating.toFixed(1)}</span>
                      </div>
                    ) : <span />}

                    {fav.priceInfo && (
                      <span className="text-xs font-semibold text-teal">{fav.priceInfo}</span>
                    )}
                  </div>

                  <h3 className="card-title">
                    <Link to={getItemLink(fav)}>{fav.title}</Link>
                  </h3>

                  {fav.subtitle && (
                    <p className="card-description">{fav.subtitle}</p>
                  )}

                  <div className="card-actions-row mt-4">
                    <Link to={getItemLink(fav)} className="btn-view-details flex-1 text-center">
                      View Details →
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFavorite(fav.id, fav.itemType, fav.itemId)}
                      className="btn-delete-trip"
                      title="Remove from favorites"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
