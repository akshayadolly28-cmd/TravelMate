import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import PlaceCard from '../components/PlaceCard';
import AddToTripModal from '../components/AddToTripModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Search, Filter, RotateCcw, MapPin, Compass, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'ALL');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('budget') || '');
  const [sortOption, setSortOption] = useState('rating');

  // Cities for dropdown
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination / Load More
  const [visibleCount, setVisibleCount] = useState(9);

  // Modal
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState('PLACE');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddToTrip = (item, type) => {
    setModalItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  // Sync state if URL query params change
  useEffect(() => {
    const urlCity = searchParams.get('city');
    const urlCat = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    if (urlCity !== null) setSelectedCity(urlCity);
    if (urlCat !== null) setSelectedCategory(urlCat);
    if (urlSearch !== null) setSearch(urlSearch);
  }, [searchParams]);

  // Load cities once
  useEffect(() => {
    API.get('/cities')
      .then((res) => {
        if (Array.isArray(res.data)) setCities(res.data);
      })
      .catch((err) => console.error('Failed to load cities', err));
  }, []);

  // Fetch places whenever filters change
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCity) {
        // match cityId from cities list if available
        const matchedCity = cities.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase());
        if (matchedCity) params.cityId = matchedCity.id;
        else params.search = selectedCity;
      }
      if (selectedCategory && selectedCategory !== 'ALL') {
        params.category = selectedCategory;
      }
      if (maxBudget) {
        params.maxBudget = Number(maxBudget);
      }
      if (sortOption) {
        params.sort = sortOption;
      }

      const res = await API.get('/places', { params });
      setPlaces(Array.isArray(res.data) ? res.data : []);
      setVisibleCount(9); // Reset pagination on filter change
    } catch (err) {
      console.error('Failed to load places', err);
      setError('Failed to load places. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [selectedCity, selectedCategory, maxBudget, sortOption, cities]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPlaces();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCity('');
    setSelectedCategory('ALL');
    setMaxBudget('');
    setSortOption('rating');
    setSearchParams({});
  };

  const categories = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'HISTORICAL', label: 'Historical & Forts' },
    { id: 'BEACHES', label: 'Beaches' },
    { id: 'NATURE', label: 'Nature & Lakes' },
    { id: 'ADVENTURE', label: 'Adventure' },
    { id: 'RELIGIOUS', label: 'Spiritual & Temples' },
    { id: 'CULTURAL', label: 'Culture & Museums' }
  ];

  const displayedPlaces = places.slice(0, visibleCount);

  return (
    <div className="explore-page-wrapper">
      {/* Page Header */}
      <div className="page-hero-header">
        <div className="page-header-content">
          <span className="page-header-eyebrow">DESTINATIONS DIRECTORY</span>
          <h1 className="page-header-title">Explore Attractions & Hidden Gems</h1>
          <p className="page-header-desc">
            Discover historic forts, serene beaches, and scenic spots with verified entry fees, visiting hours, and travel advice.
          </p>
        </div>
      </div>

      <div className="page-main-layout">
        {/* Filters Sidebar / Top Bar */}
        <div className="filter-controls-card">
          <form onSubmit={handleSearchSubmit} className="explore-search-row">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search places by name or description..."
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

          {/* Category Chips Bar */}
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

          {/* Secondary Filter Row: City, Budget, Sort */}
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
                <option value="">All Cities</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Goa">Goa</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            <div className="filter-select-group">
              <label className="filter-label">
                <SlidersHorizontal size={13} /> Max Entry Fee:
              </label>
              <select
                className="filter-select"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              >
                <option value="">Any Entry Fee</option>
                <option value="0">Free Entry Only (₹0)</option>
                <option value="50">Up to ₹50</option>
                <option value="150">Up to ₹150</option>
                <option value="500">Up to ₹500</option>
              </select>
            </div>

            <div className="filter-select-group">
              <label className="filter-label">Sort Results By:</label>
              <select
                className="filter-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="rating">Top Rated (Highest First)</option>
                <option value="name">Place Name (A to Z)</option>
                <option value="fee_asc">Entry Fee (Low to High)</option>
                <option value="fee_desc">Entry Fee (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter & Seed Data Disclaimer */}
        <div className="results-meta-bar">
          <p className="results-count-text">
            Showing <strong>{displayedPlaces.length}</strong> of <strong>{places.length}</strong> tourist destinations
            {selectedCity ? ` in ${selectedCity}` : ''}
          </p>

          <div className="seed-badge-pill" title="Seeded verified initial information">
            <Sparkles size={13} className="text-teal" />
            <span>Verified Seed Directory Data</span>
          </div>
        </div>

        {/* Places Grid */}
        {loading ? (
          <LoadingSpinner message="Filtering destinations..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchPlaces} />
        ) : places.length === 0 ? (
          <div className="empty-results-box">
            <Compass size={48} className="empty-results-icon" />
            <h3 className="empty-title">No destinations found</h3>
            <p className="empty-subtitle">
              Try adjusting your search keywords, category filters, or selecting a different city.
            </p>
            <button type="button" onClick={handleResetFilters} className="btn-primary-sm mt-4">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="cards-grid-3">
              {displayedPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} onAddToTrip={openAddToTrip} />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < places.length && (
              <div className="load-more-container">
                <button
                  type="button"
                  className="btn-load-more"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                >
                  Load More Places ({places.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add To Trip Modal */}
      <AddToTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={modalItem}
        itemType={modalType}
      />
    </div>
  );
}
