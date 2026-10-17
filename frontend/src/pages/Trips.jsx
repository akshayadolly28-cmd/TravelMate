import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  CalendarCheck2,
  Plus,
  MapPin,
  Calendar,
  Wallet,
  ArrowRight,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Trip Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('Goa');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(15000);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get('/trips');
      setTrips(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load trips', err);
      setError('Unable to load your trips. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();

    // Default dates: tomorrow to +4 days
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const inFourDays = new Date();
    inFourDays.setDate(inFourDays.getDate() + 5);

    setStartDate(tomorrow.toISOString().split('T')[0]);
    setEndDate(inFourDays.toISOString().split('T')[0]);
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!tripName.trim()) {
      setFormError('Please provide a trip title.');
      return;
    }

    if (!startDate || !endDate) {
      setFormError('Please select both start and end dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setFormError('End date cannot be earlier than start date.');
      return;
    }

    if (Number(budget) < 0) {
      setFormError('Trip budget cannot be negative.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/trips', {
        tripName: tripName.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        budget: Number(budget) || 0,
        notes: notes.trim()
      });

      setTrips((prev) => [res.data, ...prev]);
      setShowCreateModal(false);
      setTripName('');
      setNotes('');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create trip. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip and its itinerary?')) {
      return;
    }

    try {
      await API.delete(`/trips/${tripId}`);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      alert('Failed to delete trip.');
    }
  };

  // Helper to calculate days count
  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diff);
  };

  return (
    <div className="trips-page-wrapper">
      <div className="page-hero-header">
        <div className="page-header-content flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="page-header-eyebrow">ITINERARY PLANNER</span>
            <h1 className="page-header-title">My Travel Itineraries</h1>
            <p className="page-header-desc">
              Organize your vacations with day-by-day itineraries, budget trackers, and personalized activity schedules.
            </p>
          </div>
          <button
            type="button"
            className="btn-create-trip-hero"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            Create New Trip
          </button>
        </div>
      </div>

      <div className="page-main-layout">
        {loading ? (
          <LoadingSpinner message="Loading your travel plans..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchTrips} />
        ) : trips.length === 0 ? (
          <div className="empty-trips-card">
            <CalendarCheck2 size={54} className="text-teal mb-3" />
            <h3 className="empty-title">You don't have any trips planned yet</h3>
            <p className="empty-subtitle">
              Start by creating your first trip, choose your destination, and organize places, food, and stays into a day-by-day itinerary!
            </p>
            <button
              type="button"
              className="btn-primary-sm mt-4"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} />
              Plan Your First Trip
            </button>
          </div>
        ) : (
          <div className="trips-cards-grid">
            {trips.map((trip) => {
              const days = calculateDays(trip.startDate, trip.endDate);
              const itemsCount = trip.itineraryItems ? trip.itineraryItems.length : 0;

              return (
                <div key={trip.id} className="trip-summary-card">
                  <div className="trip-card-header">
                    <div className="trip-destination-badge">
                      <MapPin size={14} />
                      <span>{trip.destination}</span>
                    </div>

                    <button
                      type="button"
                      className="btn-delete-trip"
                      onClick={() => handleDeleteTrip(trip.id)}
                      title="Delete trip"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="trip-card-title">
                    <Link to={`/trips/${trip.id}`}>{trip.tripName}</Link>
                  </h3>

                  <div className="trip-dates-row">
                    <Calendar size={14} className="text-teal" />
                    <span>
                      {trip.startDate} to {trip.endDate} ({days} {days === 1 ? 'day' : 'days'})
                    </span>
                  </div>

                  <div className="trip-budget-pill">
                    <Wallet size={14} className="text-emerald" />
                    <span>Budget: ₹{Math.round(trip.budget || 0).toLocaleString()}</span>
                  </div>

                  {trip.notes && (
                    <p className="trip-notes-preview">
                      "{trip.notes}"
                    </p>
                  )}

                  <div className="trip-card-footer">
                    <span className="trip-items-count">
                      <CheckCircle2 size={14} className="text-teal" />
                      {itemsCount} scheduled {itemsCount === 1 ? 'activity' : 'activities'}
                    </span>

                    <Link to={`/trips/${trip.id}`} className="btn-open-itinerary">
                      Open Itinerary <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE TRIP MODAL */}
      {showCreateModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Plan a New Adventure</h3>
                <p className="modal-subtitle">Set your destination, travel dates, and estimated budget.</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="modal-form-content">
              {formError && (
                <div className="form-error-alert flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="modal-trip-name">Trip Name / Title:</label>
                <input
                  id="modal-trip-name"
                  type="text"
                  placeholder="e.g. Goa Beach & Heritage Getaway"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="form-input-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-destination">Destination City:</label>
                <select
                  id="modal-destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="form-select-control"
                  required
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Goa">Goa</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Jaipur">Jaipur</option>
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="modal-start-date">Start Date:</label>
                  <input
                    id="modal-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-end-date">End Date:</label>
                  <input
                    id="modal-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="modal-budget">Estimated Total Budget (₹):</label>
                <input
                  id="modal-budget"
                  type="number"
                  min="0"
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="form-input-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-notes">Trip Notes & Packing Reminders:</label>
                <textarea
                  id="modal-notes"
                  rows="2"
                  placeholder="e.g. Book train early, remember driving license for scooter rental..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-textarea-control"
                />
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-modal-confirm"
                >
                  {submitting ? 'Creating Trip...' : 'Create Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
