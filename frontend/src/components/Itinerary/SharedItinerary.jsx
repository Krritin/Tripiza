import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5667/api';

function SharedItinerary() {
  const { uuid } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSharedItinerary();
  }, [uuid]);

  const fetchSharedItinerary = async () => {
    try {
      const response = await axios.get(`${API_URL}/itinerary/share/${uuid}`);
      setItinerary(response.data);
    } catch (err) {
      setError('Itinerary not found or link is invalid');
    } finally {
      setLoading(false);
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

  const getDateForDay = (dayNumber) => {
    const date = new Date(itinerary.startDate);
    date.setDate(date.getDate() + dayNumber - 1);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading shared itinerary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <span className="text-6xl">🔍</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Not Found</h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md py-4 mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">✈️</span>
            <span className="text-xl font-bold text-gray-800">PlanMyTrip</span>
            <span className="text-gray-400 ml-4">- Shared Itinerary</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              👁️ You are viewing a shared itinerary (read-only)
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {itinerary.days.map((day) => {
            const sortedActivities = [...day.activities].sort((a, b) => 
              a.time.localeCompare(b.time)
            );

            return (
              <div key={day.day} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                  <h2 className="text-xl font-bold">Day {day.day}</h2>
                  <p className="text-sm opacity-90">{getDateForDay(day.day)}</p>
                </div>

                <div className="p-6">
                  {sortedActivities.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-4xl">📅</span>
                      <p className="text-gray-500 mt-2">No activities planned for this day</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-shrink-0 w-20 text-center">
                            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                              {activity.time}
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {activity.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              📍 {activity.location}
                            </p>
                            {activity.notes && (
                              <p className="text-gray-500 text-sm mt-2 italic">
                                💡 {activity.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SharedItinerary;