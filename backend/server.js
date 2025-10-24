const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas Connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const itineraryRoutes = require('./routes/itinerary');

app.use('/api/auth', authRoutes);
app.use('/api/itinerary', itineraryRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Travel Itinerary API is running' });
});

const PORT = process.env.PORT || 5667;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});