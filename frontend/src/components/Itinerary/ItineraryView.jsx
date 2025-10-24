import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DayTimeline from './DayTimeline';
import AddActivityModal from './AddActivityModal';
import ShareModal from './ShareModal';

const API_URL = import.meta.env.VITE_API_URL;

function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  const fetchItinerary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/itinerary/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItinerary(response.data);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      alert('Failed to load itinerary');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = (dayNumber) => {
    setSelectedDay(dayNumber);
    setShowActivityModal(true);
  };

  const handleDeleteActivity = async (dayNumber, activityIndex) => {
    if (!window.confirm('Delete this activity?')) return;

    try {
      const token = localStorage.getItem('token');
      const updatedItinerary = { ...itinerary };
      const dayIndex = updatedItinerary.days.findIndex(d => d.day === dayNumber);
      updatedItinerary.days[dayIndex].activities.splice(activityIndex, 1);

      await axios.put(`${API_URL}/itinerary/${id}`, updatedItinerary, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchItinerary();
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-2 mb-4"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {itinerary.tripName}
              </h1>
              <p className="text-gray-600">
                {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {itinerary.days.length} days • {' '}
                {itinerary.days.reduce((acc, day) => acc + day.activities.length, 0)} activities
              </p>
            </div>

            <button
              onClick={() => setShowShareModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <span>🔗</span>
              <span>Share Trip</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {itinerary.days.map((day) => (
          <DayTimeline
            key={day.day}
            day={day}
            startDate={itinerary.startDate}
            onAddActivity={() => handleAddActivity(day.day)}
            onDeleteActivity={(activityIndex) => handleDeleteActivity(day.day, activityIndex)}
          />
        ))}
      </div>

      {showActivityModal && (
        <AddActivityModal
          itineraryId={id}
          dayNumber={selectedDay}
          onClose={() => {
            setShowActivityModal(false);
            setSelectedDay(null);
          }}
          onSuccess={() => {
            setShowActivityModal(false);
            setSelectedDay(null);
            fetchItinerary();
          }}
        />
      )}

      {showShareModal && (
        <ShareModal
          shareableUUID={itinerary.shareableUUID}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}

export default ItineraryView;