import { useState, useEffect } from 'react';
import API from '../services/api';
import MarketCard from '../components/MarketCard';
import AddToTripModal from '../components/AddToTripModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Search, ShoppingBag, MapPin, RotateCcw, Sparkles } from 'lucide-react';

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [priceLevel, setPriceLevel] = useState('ALL');
  const [sortOption, setSortOption] = useState('rating');

  // Modal
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState('MARKET');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddToTrip = (item, type) => {
    setModalItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCity) params.search = selectedCity;
      if (selectedCategory && selectedCategory !== 'ALL') params.category = selectedCategory;
      if (priceLevel && priceLevel !== 'ALL') params.priceLevel = priceLevel;
      if (sortOption) params.sort = sortOption;

      const res = await API.get('/markets', { params });
      setMarkets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load markets', err);
      setError('Unable to load markets from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, [selectedCity, selectedCategory, priceLevel, sortOption]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMarkets();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCity('');
    setSelectedCategory('ALL');
    setPriceLevel('ALL');
    setSortOption('rating');
  };

  const categories = [
    { id: 'ALL', label: 'All Bazaars' },
    { id: 'STREET_MARKETS', label: 'Street Markets' },
    { id: 'HANDICRAFTS', label: 'Arts & Handicrafts' },
    { id: 'CLOTHING', label: 'Textiles & Apparel' },
    { id: 'SOUVENIRS', label: 'Jewelry & Souvenirs' },
    { id: 'LOCAL_BAZAARS', label: 'Wholesale Bazaars' }
  ];

  return (
    <div className="explore-page-wrapper">
      <div className="page-hero-header">
        <div className="page-header-content">
          <span className="page-header-eyebrow">SHOPPING & BAZAARS</span>
          <h1 className="page-header-title">Explore Bustling Markets & Handicrafts</h1>
          <p className="page-header-desc">
            Discover historic bazaars, artisan souvenir alleys, and street shopping corridors famous for local specialties.
          </p>
        </div>
      </div>

      <div className="page-main-layout">
        <div className="filter-controls-card">
          <form onSubmit={handleSearchSubmit} className="explore-search-row">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search markets by name or famous items (e.g. Bangles, Mojari, Jewelry)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="explore-search-input"
              />
            </div>
            <button type="submit" className="btn-filter-apply">
              Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-filter-reset"
              title="Reset all filters"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </form>

          {/* Category Chips */}
          <div className="category-chips-scroll">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Filters */}
          <div className="secondary-filters-grid">
            <div className="filter-select-group">
              <label className="filter-label">
                <MapPin size={13} /> Destination City:
              </label>
              <select
                className="filter-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Destinations</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Goa">Goa</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            <div className="filter-select-group">
              <label className="filter-label">Price Level:</label>
              <select
                className="filter-select"
                value={priceLevel}
                onChange={(e) => setPriceLevel(e.target.value)}
              >
                <option value="ALL">All Price Levels</option>
                <option value="BUDGET">Budget & Bargain Friendly</option>
                <option value="MODERATE">Moderate / Fixed Price</option>
                <option value="PREMIUM">Premium / Gemstones</option>
              </select>
            </div>

            <div className="filter-select-group">
              <label className="filter-label">Sort Results By:</label>
              <select
                className="filter-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="rating">Top Rated (Shopper Favorites)</option>
                <option value="name">Market Name (A to Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="results-meta-bar">
          <p className="results-count-text">
            Showing <strong>{markets.length}</strong> markets & shopping centers
            {selectedCity ? ` in ${selectedCity}` : ''}
          </p>

          <div className="seed-badge-pill">
            <Sparkles size={13} className="text-teal" />
            <span>Verified Local Bazaars</span>
          </div>
        </div>

        {/* Markets Grid */}
        {loading ? (
          <LoadingSpinner message="Locating markets and bazaars..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchMarkets} />
        ) : markets.length === 0 ? (
          <div className="empty-results-box">
            <ShoppingBag size={48} className="empty-results-icon" />
            <h3 className="empty-title">No markets found</h3>
            <p className="empty-subtitle">Try selecting a different city or category.</p>
            <button type="button" onClick={handleResetFilters} className="btn-primary-sm mt-4">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="cards-grid-3">
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} onAddToTrip={openAddToTrip} />
            ))}
          </div>
        )}
      </div>

      {/* Add to Trip Modal */}
      <AddToTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={modalItem}
        itemType={modalType}
      />
    </div>
  );
}
