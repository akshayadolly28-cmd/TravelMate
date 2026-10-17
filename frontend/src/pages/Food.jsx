import { useState, useEffect } from 'react';
import API from '../services/api';
import FoodCard from '../components/FoodCard';
import AddToTripModal from '../components/AddToTripModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Search, UtensilsCrossed, MapPin, RotateCcw, Sparkles } from 'lucide-react';

export default function Food() {
  const [foodSpots, setFoodSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortOption, setSortOption] = useState('rating');

  // Modal
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState('FOOD');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddToTrip = (item, type) => {
    setModalItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const fetchFood = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCity) params.search = selectedCity;
      if (selectedDiet && selectedDiet !== 'ALL') params.foodType = selectedDiet;
      if (selectedCategory && selectedCategory !== 'ALL') params.category = selectedCategory;
      if (sortOption) params.sort = sortOption;

      const res = await API.get('/food', { params });
      setFoodSpots(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load food spots', err);
      setError('Unable to load food spots from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFood();
  }, [selectedCity, selectedDiet, selectedCategory, sortOption]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFood();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCity('');
    setSelectedDiet('ALL');
    setSelectedCategory('ALL');
    setSortOption('rating');
  };

  const categories = [
    { id: 'ALL', label: 'All Eats' },
    { id: 'STREET_FOOD', label: 'Street Food & Stalls' },
    { id: 'RESTAURANT', label: 'Iconic Restaurants' },
    { id: 'CAFE', label: 'Heritage Cafes & Chai' },
    { id: 'SWEETS', label: 'Sweets & Bakeries' }
  ];

  // City signature highlights
  const citySignatures = {
    Hyderabad: 'Famous for Hyderabadi Mutton Dum Biryani, Slow-cooked Haleem, Irani Chai & Osmania Biscuits.',
    Goa: 'Famous for Authentic Goan Fish Curry, Rawa Fried Surmai, King Prawns Balchão & Bebinca.',
    Mumbai: 'Famous for Spiced Pav Bhaji, Gourmet Vada Pav, Colaba Seekh Kebabs & Bombay Sandwich.',
    Jaipur: 'Famous for Flaky Pyaaz Ki Kachori, Rajasthani Dal Baati Churma, Paneer Ghewar & Kulhad Chai.'
  };

  return (
    <div className="explore-page-wrapper">
      <div className="page-hero-header">
        <div className="page-header-content">
          <span className="page-header-eyebrow">LOCAL FLAVORS & DINING</span>
          <h1 className="page-header-title">Taste Authentic Local Food & Street Eats</h1>
          <p className="page-header-desc">
            Explore legendary heritage tea stalls, street food hubs, and iconic dining spots with must-try specialties and indicative prices.
          </p>
        </div>
      </div>

      <div className="page-main-layout">
        {/* City Signature Highlight Banner */}
        {selectedCity && citySignatures[selectedCity] && (
          <div className="city-flavor-banner">
            <Sparkles size={18} className="text-teal flex-shrink-0" />
            <div>
              <strong className="text-navy">{selectedCity} Specialties: </strong>
              <span>{citySignatures[selectedCity]}</span>
            </div>
          </div>
        )}

        {/* Filter Card */}
        <div className="filter-controls-card">
          <form onSubmit={handleSearchSubmit} className="explore-search-row">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search food spots, dishes (e.g. Biryani, Vada Pav, Kachori)..."
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

          {/* Secondary Filters: Diet, City, Sort */}
          <div className="secondary-filters-grid">
            <div className="filter-select-group">
              <label className="filter-label">Dietary Preference:</label>
              <select
                className="filter-select"
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
              >
                <option value="ALL">All Food Types</option>
                <option value="VEG">Pure Vegetarian Only</option>
                <option value="NON_VEG">Non-Vegetarian</option>
                <option value="BOTH">Both Veg & Non-Veg</option>
              </select>
            </div>

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
              <label className="filter-label">Sort Results By:</label>
              <select
                className="filter-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="rating">Top Rated (Foodie Favorites)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="name">Restaurant Name (A to Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="results-meta-bar">
          <p className="results-count-text">
            Showing <strong>{foodSpots.length}</strong> culinary stops
            {selectedCity ? ` in ${selectedCity}` : ''}
          </p>

          <div className="seed-badge-pill">
            <Sparkles size={13} className="text-teal" />
            <span>Curated Local Street Food Directory</span>
          </div>
        </div>

        {/* Food Spots Grid */}
        {loading ? (
          <LoadingSpinner message="Discovering regional flavors..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchFood} />
        ) : foodSpots.length === 0 ? (
          <div className="empty-results-box">
            <UtensilsCrossed size={48} className="empty-results-icon" />
            <h3 className="empty-title">No food spots found</h3>
            <p className="empty-subtitle">Try selecting a different diet filter or searching another city.</p>
            <button type="button" onClick={handleResetFilters} className="btn-primary-sm mt-4">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="cards-grid-3">
            {foodSpots.map((food) => (
              <FoodCard key={food.id} food={food} onAddToTrip={openAddToTrip} />
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
