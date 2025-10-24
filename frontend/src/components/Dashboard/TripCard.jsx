import { Link } from 'react-router-dom';

function TripCard({ trip, onDelete }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDuration = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{trip.tripName}</h3>
        <p className="text-sm opacity-90">
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
        <p className="text-sm opacity-90 mt-1">{getDuration()}</p>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{trip.days.length}</span> days planned
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">
              {trip.days.reduce((acc, day) => acc + day.activities.length, 0)}
            </span> activities
          </div>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/itinerary/${trip._id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View Details
          </Link>
          <button
            onClick={() => onDelete(trip._id)}
            className="px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripCard;