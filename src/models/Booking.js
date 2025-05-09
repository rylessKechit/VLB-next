// src/models/Booking.js - Mise à jour du modèle sans assignation de chauffeur
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  dropoffAddress: {
    type: String,
    required: true,
  },
  pickupDateTime: {
    type: Date,
    required: true,
  },
  passengers: {
    type: Number,
    required: true,
    min: 1,
    max: 7,
  },
  luggage: {
    type: Number,
    required: true,
    min: 0,
    max: 7,
  },
  roundTrip: {
    type: Boolean,
    default: false,
  },
  returnDateTime: {
    type: Date,
  },
  flightNumber: {
    type: String,
  },
  trainNumber: {
    type: String,
  },
  specialRequests: {
    type: String,
  },
  price: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'EUR',
    },
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  pickupAddressPlaceId: String,
  dropoffAddressPlaceId: String,
  notes: String,
  adminNotes: String,
  // Suppression du champ assignedDriver
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
});

// Middleware pre-save pour mettre à jour le champ updatedAt
BookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Si le statut change vers "in_progress", mettre à jour startedAt
  if (this.isModified('status') && this.status === 'in_progress' && !this.startedAt) {
    this.startedAt = Date.now();
  }
  
  // Si le statut change vers "completed", mettre à jour completedAt
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = Date.now();
  }
  
  next();
});

// Vérifier si le modèle existe déjà pour éviter les erreurs en développement avec hot-reload
export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);