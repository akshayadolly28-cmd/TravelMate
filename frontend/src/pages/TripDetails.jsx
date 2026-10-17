import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Wallet,
  Clock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  X,
  Compass,
  Hotel,
  UtensilsCrossed,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Day Tab (Day 1, Day 2, etc.)
  const [activeDay, setActiveDay] = useState(1);

  // Add/Edit Activity Modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemType, setItemType] = useState('PLACE');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [notes, setNotes] = useState('');
  const [submittingItem, setSubmittingItem] = useState(false);
  const [itemModalError, setItemModalError] = useState('');

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`/trips/${id}`);
      setTrip(res.data);
    } catch (err) {
      console.error('Failed to load trip details', err);
      setError('Trip not found or you do not have permission to view it.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading trip itinerary..." />;
  }

  if (error || !trip) {
    return (
      <div className="section-container text-center py-16">
        <ErrorMessage message={error || 'Trip not found.'} onRetry={fetchTripDetails} />
        <Link to="/trips" className="btn-nav-outline mt-6 inline-flex">
          <ArrowLeft size={16} /> Back to My Trips
        </Link>
      </div>
    );
  }

  // Calculate day tabs count based on start and end date
  const calculateTotalDays = () => {
    if (!trip.startDate || !trip.endDate) return 3;
    const s = new Date(trip.startDate);
    const e = new Date(trip.endDate);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(30, diff));
  };

  const totalDays = calculateTotalDays();
  const itineraryItems = trip.itineraryItems || [];

  // Filter items for current active day tab
  const dayItems = itineraryItems.filter((item) => (item.dayNumber || 1) === activeDay);

  // Budget calculations
  const totalAllocated = itineraryItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const totalBudget = trip.budget || 0;
  const remainingBudget = totalBudget - totalAllocated;
  const budgetPercent = totalBudget > 0 ? Math.min(100, Math.round((totalAllocated / totalBudget) * 100)) : 0;

  // Open modal for adding activity on current active day
  const handleOpenAddModal = () => {
    setEditingItemId(null);
    setItemType('PLACE');
    setTitle('');
    setLocation(trip.destination || '');
    setDayNumber(activeDay);
    setStartTime('10:00');
    setEndTime('12:00');
    setEstimatedCost(0);
    setNotes('');
    setItemModalError('');
    setShowItemModal(true);
  };

  // Open modal for editing existing activity
  const handleOpenEditModal = (item) => {
    setEditingItemId(item.id);
    setItemType(item.itemType || 'PLACE');
    setTitle(item.title || '');
    setLocation(item.location || '');
    setDayNumber(item.dayNumber || 1);
    setStartTime(item.startTime || '10:00');
    setEndTime(item.endTime || '12:00');
    setEstimatedCost(item.estimatedCost || 0);
    setNotes(item.notes || '');
    setItemModalError('');
    setShowItemModal(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setItemModalError('Title is required.');
      return;
    }

    setSubmittingItem(true);
    setItemModalError('');

    try {
      if (editingItemId) {
        // Update existing item
        const res = await API.put(`/trips/${trip.id}/itinerary/${editingItemId}`, {
          itemType,
          title: title.trim(),
          location: location.trim(),
          dayNumber: Number(dayNumber),
          startTime,
          endTime,
          estimatedCost: Number(estimatedCost) || 0,
          notes: notes.trim()
        });

        setTrip((prev) => ({
          ...prev,
          itineraryItems: prev.itineraryItems.map((item) =>
            item.id === editingItemId ? res.data : item
          )
        }));
      } else {
        // Add new item
        const res = await API.post(`/trips/${trip.id}/itinerary`, {
          itemType,
          title: title.trim(),
          location: location.trim(),
          dayNumber: Number(dayNumber),
          startTime,
          endTime,
          estimatedCost: Number(estimatedCost) || 0,
          notes: notes.trim()
        });

        setTrip((prev) => ({
          ...prev,
          itineraryItems: [...(prev.itineraryItems || []), res.data]
        }));
      }

      setShowItemModal(false);
    } catch (err) {
      setItemModalError(err.response?.data?.message || 'Failed to save itinerary item.');
    } finally {
      setSubmittingItem(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Remove this activity from your itinerary?')) return;

    try {
      await API.delete(`/trips/${trip.id}/itinerary/${itemId}`);
      setTrip((prev) => ({
        ...prev,
        itineraryItems: prev.itineraryItems.filter((item) => item.id !== itemId)
      }));
    } catch (err) {
      alert('Failed to remove activity.');
    }
  };

  const getItemTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'STAY':
        return <Hotel size={16} className="text-amber" />;
      case 'FOOD':
        return <UtensilsCrossed size={16} className="text-rose" />;
      case 'MARKET':
        return <ShoppingBag size={16} className="text-purple" />;
      default:
        return <Compass size={16} className="text-teal" />;
    }
  };

  return (
    <div className="trip-details-page-wrapper">
      {/* Top Breadcrumb */}
      <div className="details-top-bar">
        <div className="details-container flex justify-between items-center">
          <Link to="/trips" className="btn-back-link">
            <ArrowLeft size={16} /> All Trips
          </Link>
          <div className="details-breadcrumbs">
            <Link to="/trips">My Trips</Link>
            <span>/</span>
            <span className="text-navy font-semibold">{trip.tripName}</span>
          </div>
        </div>
      </div>

      <div className="details-container">
        {/* Trip Overview Header Card */}
        <div className="trip-overview-card">
          <div className="trip-overview-top flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="trip-destination-badge inline-flex mb-2">
                <MapPin size={14} />
                <span>{trip.destination}</span>
              </div>
              <h1 className="trip-title-heading">{trip.tripName}</h1>
              <div className="trip-dates-row mt-2">
                <Calendar size={15} className="text-teal" />
                <span>
                  {trip.startDate} to {trip.endDate} ({totalDays} {totalDays === 1 ? 'day' : 'days'})
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-create-trip-hero"
              onClick={handleOpenAddModal}
            >
              <Plus size={18} />
              Add Activity to Day {activeDay}
            </button>
          </div>

          {trip.notes && (
            <div className="trip-notes-banner mt-4">
              <span className="font-semibold text-navy">Trip Notes: </span>
              <span>{trip.notes}</span>
            </div>
          )}

          {/* Budget Progress Bar */}
          <div className="trip-budget-tracker-box mt-6">
            <div className="budget-tracker-header flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-navy flex items-center gap-1">
                <Wallet size={15} className="text-teal" /> Budget Allocation
              </span>
              <span className="text-sm text-muted">
                ₹{totalAllocated.toLocaleString()} allocated of ₹{totalBudget.toLocaleString()} total
              </span>
            </div>

            <div className="budget-progress-bar-bg">
              <div
                className={`budget-progress-fill ${budgetPercent > 90 ? 'bg-rose' : 'bg-teal'}`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>

            <div className="budget-stats-row flex justify-between text-xs text-muted mt-2">
              <span>{budgetPercent}% allocated</span>
              <span className={remainingBudget < 0 ? 'text-rose font-semibold' : 'text-emerald font-semibold'}>
                {remainingBudget >= 0
                  ? `₹${remainingBudget.toLocaleString()} remaining budget`
                  : `₹${Math.abs(remainingBudget).toLocaleString()} over budget`}
              </span>
            </div>
          </div>
        </div>

        {/* Day-by-Day Itinerary Section */}
        <div className="itinerary-section-card mt-8">
          <div className="itinerary-header-bar flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-navy">Day-by-Day Travel Schedule</h2>
              <p className="text-sm text-muted">Organize your daily activities in sequence.</p>
            </div>

            <button
              type="button"
              className="btn-primary-sm"
              onClick={handleOpenAddModal}
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          {/* Day Navigation Tabs */}
          <div className="day-tabs-scroll-bar">
            {Array.from({ length: totalDays }, (_, idx) => idx + 1).map((dayNum) => {
              const dayItemsCount = itineraryItems.filter((item) => (item.dayNumber || 1) === dayNum).length;
              return (
                <button
                  key={dayNum}
                  type="button"
                  className={`day-tab-pill ${activeDay === dayNum ? 'active' : ''}`}
                  onClick={() => setActiveDay(dayNum)}
                >
                  <span className="day-tab-label">Day {dayNum}</span>
                  <span className="day-tab-count">
                    {dayItemsCount} {dayItemsCount === 1 ? 'item' : 'items'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timeline of Items for Active Day */}
          <div className="day-timeline-content mt-6">
            {dayItems.length === 0 ? (
              <div className="empty-day-timeline text-center py-12">
                <Compass size={40} className="text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-navy">No activities scheduled for Day {activeDay}</h4>
                <p className="text-sm text-muted max-w-md mx-auto mt-1 mb-4">
                  Add tourist places, food stops, local markets, or custom travel plans to this day.
                </p>
                <div className="flex gap-3 justify-center">
                  <button type="button" className="btn-primary-sm" onClick={handleOpenAddModal}>
                    <Plus size={16} /> Add Custom Activity
                  </button>
                  <Link to="/explore" className="btn-nav-outline text-sm">
                    Browse Places to Add
                  </Link>
                </div>
              </div>
            ) : (
              <div className="timeline-items-list">
                {dayItems.map((item, index) => (
                  <div key={item.id} className="timeline-item-row group">
                    <div className="timeline-marker-column">
                      <div className="timeline-order-badge">{index + 1}</div>
                      {index < dayItems.length - 1 && <div className="timeline-line-connector" />}
                    </div>

                    <div className="timeline-item-card flex-1">
                      <div className="timeline-card-header flex justify-between items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="timeline-type-pill">
                              {getItemTypeIcon(item.itemType)}
                              <span>{item.itemType || 'PLACE'}</span>
                            </span>
                            {item.location && (
                              <span className="text-xs text-muted flex items-center gap-1">
                                <MapPin size={12} /> {item.location}
                              </span>
                            )}
                          </div>
                          <h4 className="timeline-item-title">{item.title}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="btn-item-action"
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit activity"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn-item-action text-rose"
                            onClick={() => handleDeleteItem(item.id)}
                            title="Remove activity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="timeline-meta-row flex gap-4 text-xs text-muted mt-2">
                        {(item.startTime || item.endTime) && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-teal" />
                            {item.startTime} - {item.endTime}
                          </span>
                        )}
                        {item.estimatedCost > 0 && (
                          <span className="flex items-center gap-1 font-semibold text-navy">
                            <DollarSign size={12} className="text-emerald" />
                            Est. ₹{item.estimatedCost}
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <p className="timeline-item-notes mt-2">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD / EDIT ITINERARY ITEM MODAL */}
      {showItemModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowItemModal(false)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  {editingItemId ? 'Edit Activity' : `Add Activity to Day ${dayNumber}`}
                </h3>
                <p className="modal-subtitle">Schedule your place visit, stay, or dining experience.</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowItemModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="modal-form-content">
              {itemModalError && (
                <div className="form-error-alert flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{itemModalError}</span>
                </div>
              )}

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="activity-type">Activity Category:</label>
                  <select
                    id="activity-type"
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="form-select-control"
                  >
                    <option value="PLACE">Tourist Attraction / Place</option>
                    <option value="FOOD">Food / Dining</option>
                    <option value="STAY">Accommodation Check-In</option>
                    <option value="MARKET">Market & Shopping</option>
                    <option value="CUSTOM">Custom Travel Activity</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="activity-day">Scheduled Day:</label>
                  <select
                    id="activity-day"
                    value={dayNumber}
                    onChange={(e) => setDayNumber(e.target.value)}
                    className="form-select-control"
                  >
                    {Array.from({ length: totalDays }, (_, idx) => idx + 1).map((d) => (
                      <option key={d} value={d}>
                        Day {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="activity-title">Activity Title / Name:</label>
                <input
                  id="activity-title"
                  type="text"
                  placeholder="e.g. Morning Walk at Fort Aguada, Biryani Lunch at Paradise..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="activity-location">Location / Landmark:</label>
                <input
                  id="activity-location"
                  type="text"
                  placeholder="e.g. Candolim Beach Road, North Goa"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-input-control"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="item-start-time">Start Time:</label>
                  <input
                    id="item-start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="form-input-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="item-end-time">End Time:</label>
                  <input
                    id="item-end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="form-input-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="item-cost">Estimated Cost (₹):</label>
                <input
                  id="item-cost"
                  type="number"
                  min="0"
                  step="50"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="form-input-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="item-notes-text">Personal Activity Notes:</label>
                <textarea
                  id="item-notes-text"
                  rows="2"
                  placeholder="e.g. Remember sunglasses, carry change for entry tickets..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-textarea-control"
                />
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowItemModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingItem}
                  className="btn-modal-confirm"
                >
                  {submittingItem ? 'Saving...' : editingItemId ? 'Update Activity' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
