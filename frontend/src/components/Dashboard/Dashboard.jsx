import { useState, useEffect } from 'react';
import axios from 'axios';
import TripCard from './TripCard';
import CreateTripModal from './CreateTripModal';

const API_URL = 'http://localhost:5667/api';

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [searchTerm, yearFilter, trips]);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/itinerary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(response.data);
      setFilteredTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTrips = () => {
    let filtered = trips;

    if (searchTerm) {
      filtered = filtered.filter(trip =>
        trip.tripName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (yearFilter) {
      filtered = filtered.filter(trip => {
        const tripYear = new Date(trip.startDate).getFullYear().toString();
        return tripYear === yearFilter;
      });
    }

    setFilteredTrips(filtered);
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/itinerary/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip');
    }
  };

  const years = [...new Set(trips.map(trip => 
    new Date(trip.startDate).getFullYear().toString()
  ))].sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Trips</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <span className="text-xl">+</span>
          <span>Create New Trip</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Search Trips</label>
            <input
              type="text"
              placeholder="Search by trip name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Filter by Year</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading trips...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <span className="text-6xl">🗺️</span>
          <h2 className="text-2xl font-semibold text-gray-700 mt-4">No trips found</h2>
          <p className="text-gray-500 mt-2">
            {searchTerm || yearFilter ? 'Try adjusting your filters' : 'Create your first trip to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <TripCard
              key={trip._id}
              trip={trip}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateTripModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchTrips();
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;