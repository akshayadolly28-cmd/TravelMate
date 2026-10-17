import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import PlaceCard from '../components/PlaceCard';
import StayCard from '../components/StayCard';
import FoodCard from '../components/FoodCard';
import MarketCard from '../components/MarketCard';
import AddToTripModal from '../components/AddToTripModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  Search,
  MapPin,
  Calendar,
  Compass,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Wallet,
  UtensilsCrossed,
  Hotel,
  ShoppingBag,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  // Search Bar States
  const [searchCity, setSearchCity] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Data States
  const [cities, setCities] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [trendingPlaces, setTrendingPlaces] = useState([]);
  const [budgetStays, setBudgetStays] = useState([]);
  const [famousFood, setFamousFood] = useState([]);
  const [topMarkets, setTopMarkets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add to Trip Modal State
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState('PLACE');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddToTrip = (item, type) => {
    setModalItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [citiesRes, placesRes, staysRes, foodRes, marketsRes] = await Promise.all([
        API.get('/cities'),
        API.get('/places/popular'),
        API.get('/stays/featured'),
        API.get('/food/featured'),
        API.get('/markets/featured')
      ]);

      setCities(Array.isArray(citiesRes.data) ? citiesRes.data : []);
      setPopularPlaces(Array.isArray(placesRes.data) ? placesRes.data.slice(0, 6) : []);
      setBudgetStays(Array.isArray(staysRes.data) ? staysRes.data.slice(0, 3) : []);
      setFamousFood(Array.isArray(foodRes.data) ? foodRes.data.slice(0, 3) : []);
      setTopMarkets(Array.isArray(marketsRes.data) ? marketsRes.data.slice(0, 3) : []);

      // Load trending places
      const trendingRes = await API.get('/places/trending');
      setTrendingPlaces(Array.isArray(trendingRes.data) ? trendingRes.data.slice(0, 3) : []);
    } catch (err) {
      console.error('Home data load error', err);
      setError('Could not load travel recommendations from the server. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.append('search', searchKeyword.trim());
    if (searchCity) params.append('city', searchCity);
    if (searchCategory) params.append('category', searchCategory);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="home-page-container">
      {/* ========================================================
          HERO SECTION
      ======================================================== */}
      <section className="home-hero-section">
        <div className="hero-backdrop-image" />
        <div className="hero-dark-overlay" />

        <div className="hero-content-wrapper">
          <div className="hero-eyebrow-pill">
            <Sparkles size={14} className="text-teal" />
            <span>Smart Tourist Information & Itinerary Platform</span>
          </div>

          <h1 className="hero-main-title">
            Your Next Adventure <br />
            <span className="hero-title-highlight">Starts Here.</span>
          </h1>

          <p className="hero-description-text">
            Discover hidden gems, budget stays, local street food, and unforgettable experiences across India's most enchanting destinations.
          </p>

          {/* Interactive Multi-Filter Search Card */}
          <div className="hero-search-card">
            <form onSubmit={handleSearchSubmit} className="hero-search-form">
              <div className="search-field-group">
                <label className="search-label">
                  <MapPin size={14} /> Destination
                </label>
                <select
                  className="search-select"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                >
                  <option value="">All Destinations</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Goa">Goa</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Jaipur">Jaipur</option>
                </select>
              </div>

              <div className="search-divider" />

              <div className="search-field-group">
                <label className="search-label">
                  <Compass size={14} /> Experience Type
                </label>
                <select
                  className="search-select"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="HISTORICAL">Historical & Heritage</option>
                  <option value="BEACHES">Beaches & Coastal</option>
                  <option value="NATURE">Nature & Lakes</option>
                  <option value="ADVENTURE">Adventure & Theme Parks</option>
                  <option value="RELIGIOUS">Religious & Spiritual</option>
                  <option value="CULTURAL">Cultural & Museums</option>
                </select>
              </div>

              <div className="search-divider" />

              <div className="search-field-group flex-1">
                <label className="search-label">
                  <Search size={14} /> Keyword or Place
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fort, Biryani, Beach, Sunset..."
                  className="search-input-text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <button type="submit" className="hero-search-submit-btn">
                <Search size={18} />
                <span>Search</span>
              </button>
            </form>

            {/* Quick Destination Pills */}
            <div className="hero-quick-cities">
              <span className="quick-cities-label">Popular Destinations:</span>
              {['Hyderabad', 'Goa', 'Mumbai', 'Jaipur'].map((city) => (
                <Link
                  key={city}
                  to={`/explore?city=${city}`}
                  className="quick-city-chip"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CITIES CAROUSEL / HIGHLIGHTS
      ======================================================== */}
      <section className="section-container">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">FEATURED HUBS</span>
            <h2 className="section-title">Explore by City</h2>
            <p className="section-subtext">
              Handpicked travel guides with verified tourist attractions, stays, food spots, and local markets.
            </p>
          </div>
          <Link to="/explore" className="section-view-all-link">
            All Cities <ChevronRight size={16} />
          </Link>
        </div>

        {cities.length > 0 ? (
          <div className="city-cards-grid">
            {cities.map((city) => (
              <Link
                key={city.id}
                to={`/explore?city=${encodeURIComponent(city.name)}`}
                className="city-hero-card group"
              >
                <img
                  src={city.imageUrl || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'}
                  alt={city.name}
                  className="city-hero-img"
                  loading="lazy"
                />
                <div className="city-hero-gradient" />
                <div className="city-hero-content">
                  <span className="city-state-pill">{city.state}, India</span>
                  <h3 className="city-name-title">{city.name}</h3>
                  <p className="city-desc-snippet">{city.description}</p>
                  <span className="city-explore-cta">
                    Explore Guide <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : loading ? (
          <LoadingSpinner message="Loading popular cities..." />
        ) : null}
      </section>

      {/* ========================================================
          POPULAR DESTINATIONS GRID
      ======================================================== */}
      <section className="section-container">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">MUST-VISIT PLACES</span>
            <h2 className="section-title">Top Tourist Attractions</h2>
            <p className="section-subtext">
              Iconic heritage forts, scenic coastlines, and historic landmarks with entry details and insider travel tips.
            </p>
          </div>
          <Link to="/explore" className="section-view-all-link">
            Explore All Attractions ({popularPlaces.length}+) <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading destinations..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadHomeData} />
        ) : popularPlaces.length > 0 ? (
          <div className="cards-grid-3">
            {popularPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} onAddToTrip={openAddToTrip} />
            ))}
          </div>
        ) : (
          <p className="empty-text">No places available yet.</p>
        )}
      </section>

      {/* ========================================================
          BUDGET-FRIENDLY STAYS PREVIEW
      ======================================================== */}
      <section className="section-container bg-subtle-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">COMFORT ON A BUDGET</span>
            <h2 className="section-title">Budget-Friendly Stays</h2>
            <p className="section-subtext">
              Quality hostels, boutique hotels, and authentic homestays priced for student and backpacker budgets.
            </p>
          </div>
          <Link to="/stays" className="section-view-all-link">
            View All Stays <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Finding affordable stays..." />
        ) : budgetStays.length > 0 ? (
          <div className="cards-grid-3">
            {budgetStays.map((stay) => (
              <StayCard key={stay.id} stay={stay} onAddToTrip={openAddToTrip} />
            ))}
          </div>
        ) : null}
      </section>

      {/* ========================================================
          LOCAL FOOD & STREET FOOD PREVIEW
      ======================================================== */}
      <section className="section-container">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">TASTE THE CITY</span>
            <h2 className="section-title">Must-Try Street Food & Local Eats</h2>
            <p className="section-subtext">
              Authentic regional delicacies, famous breakfast tea stalls, and iconic biryani houses.
            </p>
          </div>
          <Link to="/food" className="section-view-all-link">
            Explore All Food Spots <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Cooking local dishes..." />
        ) : famousFood.length > 0 ? (
          <div className="cards-grid-3">
            {famousFood.map((food) => (
              <FoodCard key={food.id} food={food} onAddToTrip={openAddToTrip} />
            ))}
          </div>
        ) : null}
      </section>

      {/* ========================================================
          MARKETS & SHOPPING PREVIEW
      ======================================================== */}
      <section className="section-container bg-subtle-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">LOCAL BAZAARS</span>
            <h2 className="section-title">Popular Markets & Handicrafts</h2>
            <p className="section-subtext">
              Bustling street shopping, artisan villages, authentic spices, and souvenir bargaining hubs.
            </p>
          </div>
          <Link to="/markets" className="section-view-all-link">
            View All Markets <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Exploring markets..." />
        ) : topMarkets.length > 0 ? (
          <div className="cards-grid-3">
            {topMarkets.map((market) => (
              <MarketCard key={market.id} market={market} onAddToTrip={openAddToTrip} />
            ))}
          </div>
        ) : null}
      </section>

      {/* ========================================================
          WHY CHOOSE TRAVELMATE (4 PILLARS)
      ======================================================== */}
      <section className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-eyebrow">ALL-IN-ONE PLATFORM</span>
          <h2 className="section-title">Why Travelers Love TravelMate</h2>
          <p className="section-subtext">
            Everything you need to research, organize, and experience unforgettable Indian getaways without spreadsheet headaches.
          </p>
        </div>

        <div className="features-four-grid">
          <div className="feature-card">
            <div className="feature-icon-box bg-teal-soft">
              <Calendar size={26} className="text-teal" />
            </div>
            <h3 className="feature-card-title">Day-by-Day Trip Planner</h3>
            <p className="feature-card-desc">
              Organize destinations, stays, and meals on chronological daily timelines with budget tracking and personal activity notes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box bg-amber-soft">
              <Hotel size={26} className="text-amber" />
            </div>
            <h3 className="feature-card-title">Budget-Friendly Stays</h3>
            <p className="feature-card-desc">
              Discover verified backpacker hostels, friendly family homestays, and budget hotels with amenities and transparent indicative rates.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box bg-rose-soft">
              <UtensilsCrossed size={26} className="text-rose" />
            </div>
            <h3 className="feature-card-title">Authentic Local Food</h3>
            <p className="feature-card-desc">
              Never miss a city's signature dishes, from Hyderabad's dum biryani and Irani chai to Mumbai's pav bhaji and Goa's seafood curries.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box bg-purple-soft">
              <Wallet size={26} className="text-purple" />
            </div>
            <h3 className="feature-card-title">Smart Travel Utilities</h3>
            <p className="feature-card-desc">
              Instant currency converter, interactive trip expense calculator, synced packing checklist, and weather forecasts in one tab.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          CALL TO ACTION BANNER
      ======================================================== */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-content">
            <span className="cta-eyebrow">READY TO EXPLORE?</span>
            <h2 className="cta-title">Start Planning Your Dream Trip Today</h2>
            <p className="cta-text">
              Create an account in 10 seconds to save destinations to your favorites and organize daily travel itineraries.
            </p>
            <div className="cta-buttons-row">
              <Link to="/register" className="btn-cta-primary">
                Create Free Account
              </Link>
              <Link to="/explore" className="btn-cta-secondary">
                Explore Destinations First
              </Link>
            </div>
          </div>
        </div>
      </section>

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
