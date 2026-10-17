import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { X, Calendar, Clock, DollarSign, Plus, Check } from 'lucide-react';

export default function AddToTripModal({ isOpen, onClose, item, itemType = 'PLACE' }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:30');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [notes, setNotes] = useState('');
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setLoadingTrips(true);
      setError('');
      setSuccess(false);
      API.get('/trips')
        .then((res) => {
          if (Array.isArray(res.data)) {
            setTrips(res.data);
            if (res.data.length > 0) {
              setSelectedTripId(res.data[0].id);
            }
          }
        })
        .catch(() => setError('Failed to load your trips.'))
        .finally(() => setLoadingTrips(false));

      // Preset default cost from item
      if (item) {
        if (item.entryFee) setEstimatedCost(item.entryFee);
        else if (item.indicativePrice) setEstimatedCost(item.indicativePrice);
        else if (item.pricePerNight) setEstimatedCost(item.pricePerNight);
        else setEstimatedCost(0);
      }
    }
  }, [isOpen, user, item]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTripId) {
      setError('Please select or create a trip first.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await API.post(`/trips/${selectedTripId}/itinerary`, {
        referenceId: item?.id,
        placeId: itemType === 'PLACE' ? item?.id : null,
        itemType,
        title: item?.name || item?.title || 'Trip Activity',
        location: item?.address || item?.cityName || '',
        dayNumber: Number(dayNumber),
        startTime,
        endTime,
        estimatedCost: Number(estimatedCost) || 0,
        notes: notes.trim()
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to itinerary.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Add to Itinerary</h3>
            <p className="modal-subtitle">
              Plan <strong className="text-navy">{item?.name}</strong> into your trip schedule.
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {!user ? (
          <div className="modal-auth-prompt">
            <p>You need to be logged in to add destinations to your travel itineraries.</p>
            <div className="flex gap-3 justify-center mt-4">
              <Link to="/login" className="btn-nav-outline" onClick={onClose}>
                Log In
              </Link>
              <Link to="/register" className="btn-nav-primary" onClick={onClose}>
                Create Free Account
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form-content">
            {error && <div className="form-error-alert">{error}</div>}
            {success && (
              <div className="form-success-alert">
                <Check size={18} />
                <span>Successfully added to your trip itinerary!</span>
              </div>
            )}

            {loadingTrips ? (
              <p className="py-4 text-center text-muted">Loading your trips...</p>
            ) : trips.length === 0 ? (
              <div className="empty-trips-modal-box">
                <p>You don't have any trips created yet.</p>
                <Link to="/trips" className="btn-primary-sm mt-3" onClick={onClose}>
                  <Plus size={16} />
                  Create Your First Trip
                </Link>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="trip-select">Select Trip:</label>
                  <select
                    id="trip-select"
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="form-select-control"
                    required
                  >
                    {trips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.tripName} ({t.destination})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="day-num">
                      <Calendar size={14} /> Day Number:
                    </label>
                    <input
                      id="day-num"
                      type="number"
                      min="1"
                      max="30"
                      value={dayNumber}
                      onChange={(e) => setDayNumber(e.target.value)}
                      className="form-input-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="est-cost">
                      <DollarSign size={14} /> Est. Cost (₹):
                    </label>
                    <input
                      id="est-cost"
                      type="number"
                      min="0"
                      step="10"
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(e.target.value)}
                      className="form-input-control"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="start-time">
                      <Clock size={14} /> Start Time:
                    </label>
                    <input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="form-input-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="end-time">
                      <Clock size={14} /> End Time:
                    </label>
                    <input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="form-input-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="item-notes">Personal Activity Notes:</label>
                  <textarea
                    id="item-notes"
                    rows="2"
                    placeholder="e.g. Remember to buy tickets online, wear walking shoes, try local snack outside..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="form-textarea-control"
                  />
                </div>

                <div className="modal-actions-footer">
                  <button type="button" className="btn-modal-cancel" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || success}
                    className="btn-modal-confirm"
                  >
                    {submitting ? 'Saving...' : success ? 'Added!' : 'Add to Trip'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
