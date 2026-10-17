import { useState, useEffect } from 'react';
import API from '../services/api';
import StayCard from '../components/StayCard';
import AddToTripModal from '../components/AddToTripModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Search, Hotel, MapPin, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';

export default function Stays() {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('price_asc');

  // Modal
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState('STAY');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddToTrip = (item, type) => {
    setModalItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const fetchStays = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCity) params.search = selectedCity;
      if (selectedType && selectedType !== 'ALL') params.type = selectedType;
      if (maxPrice) params.maxPrice = Number(maxPrice);
      if (sortOption) params.sort = sortOption;

      const res = await API.get('/stays', { params });
      setStays(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load stays', err);
      setError('Unable to load stays from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStays();
  }, [selectedCity, selectedType, maxPrice, sortOption]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStays();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCity('');
    setSelectedType('ALL');
    setMaxPrice('');
    setSortOption('price_asc');
  };

  const stayTypes = [
    { id: 'ALL', label: 'All Accommodations' },
    { id: 'HOSTEL', label: 'Backpacker Hostels' },
    { id: 'HOTEL', label: 'Hotels' },
    { id: 'HOMESTAY', label: 'Heritage Homestays' },
    { id: 'GUESTHOUSE', label: 'Guesthouses & Cottages' }
  ];

  return (
    <div className="explore-page-wrapper">
      <div className="page-hero-header">
        <div className="page-header-content">
          <span className="page-header-eyebrow">BUDGET ACCOMMODATION</span>
          <h1 className="page-header-title">Discover Budget-Friendly Stays</h1>
          <p className="page-header-desc">
            Find verified backpacker hostels, friendly homestays, and boutique guesthouses designed for students and solo travelers.
          </p>
        </div>
      </div>

      <div className="page-main-layout">
        {/* Filter Card */}
        <div className="filter-controls-card">
          <form onSubmit={handleSearchSubmit} className="explore-search-row">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search stays by property name or location..."
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

          {/* Type Chips */}
          <div className="category-chips-scroll">
            {stayTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`filter-chip ${selectedType === type.id ? 'active' : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                {type.label}
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
              <label className="filter-label">
                <SlidersHorizontal size={13} /> Max Budget / Night:
              </label>
              <select
                className="filter-select"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >
                <option value="">Any Budget</option>
                <option value="1000">Under ₹1,000 / night</option>
                <option value="2000">Under ₹2,000 / night</option>
                <option value="3500">Under ₹3,500 / night</option>
              </select>
            </div>

            <div className="filter-select-group">
              <label className="filter-label">Sort Results By:</label>
              <select
                className="filter-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Guest Rating (Highest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="results-meta-bar">
          <p className="results-count-text">
            Showing <strong>{stays.length}</strong> budget stays available
            {selectedCity ? ` in ${selectedCity}` : ''}
          </p>

          <div className="seed-badge-pill">
            <Sparkles size={13} className="text-teal" />
            <span>Indicative Nightly Rates (No Commission)</span>
          </div>
        </div>

        {/* Stays Grid */}
        {loading ? (
          <LoadingSpinner message="Searching accommodation..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchStays} />
        ) : stays.length === 0 ? (
          <div className="empty-results-box">
            <Hotel size={48} className="empty-results-icon" />
            <h3 className="empty-title">No stays found</h3>
            <p className="empty-subtitle">Try selecting a different city or clearing the budget filter.</p>
            <button type="button" onClick={handleResetFilters} className="btn-primary-sm mt-4">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="cards-grid-3">
            {stays.map((stay) => (
              <StayCard key={stay.id} stay={stay} onAddToTrip={openAddToTrip} />
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
