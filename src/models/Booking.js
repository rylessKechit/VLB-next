// src/models/Booking.js - Version avec support des fourchettes de prix

import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'confirmed',
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
      description: 'Prix maximum de la fourchette ou prix convenu'
    },
    currency: {
      type: String,
      default: 'EUR',
    },
    // Système tarifaire
    tariffApplied: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: true,
      description: 'A: Jour retour en charge, B: Nuit/weekend retour en charge, C: Jour retour à vide, D: Nuit/weekend retour à vide'
    },
    tariffName: {
      type: String,
      required: true,
    },
    breakdown: {
      baseFare: {
        type: Number,
        required: true,
        default: 2.60,
        description: 'Prise en charge fixe de 2,60€'
      },
      distanceCharge: {
        type: Number,
        required: true,
        description: 'Montant calculé selon la distance'
      },
      pricePerKm: {
        type: Number,
        required: true,
        description: 'Tarif au kilomètre selon le type de course'
      },
      actualDistance: {
        type: Number,
        required: true,
        description: 'Distance réelle en kilomètres'
      },
      minimumCourse: {
        type: Number,
        description: 'Course minimum appliquée (20€ standard, 25€ VAN)'
      },
      approachFee: {
        type: Number,
        required: true,
        description: 'Frais d\'approche (13€ jour, 10€ nuit)'
      },
      isNightTime: {
        type: Boolean,
        default: false,
        description: 'Indique si la course est de nuit (19h-8h)'
      },
      isWeekendOrHoliday: {
        type: Boolean,
        default: false,
        description: 'Indique si c\'est un dimanche ou jour férié'
      },
      conditions: {
        timeOfDay: {
          type: String,
          enum: ['jour', 'nuit'],
          required: true,
          description: 'Moment de la journée'
        },
        dayType: {
          type: String,
          enum: ['semaine', 'weekend/férié'],
          required: true,
          description: 'Type de jour'
        },
        returnType: {
          type: String,
          enum: ['en charge', 'à vide'],
          required: true,
          description: 'Type de retour (aller-retour ou aller simple)'
        },
      },
    },
    // NOUVEAU : Fourchette de prix
    priceRange: {
      min: {
        type: Number,
        description: 'Prix minimum de la fourchette'
      },
      max: {
        type: Number,
        description: 'Prix maximum de la fourchette'
      }
    },
    // NOUVEAU : Prix final négocié
    finalPrice: {
      type: Number,
      description: 'Prix final convenu avec le chauffeur (dans la fourchette)'
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
  vehicleType: {
    type: String,
    enum: ['green', 'berline', 'van'],
    required: true,
    description: 'Type de véhicule sélectionné par le client'
  },
  pickupAddressPlaceId: {
    type: String,
    description: 'ID Google Places pour l\'adresse de départ'
  },
  dropoffAddressPlaceId: {
    type: String,
    description: 'ID Google Places pour l\'adresse d\'arrivée'
  },
  notes: {
    type: String,
    description: 'Notes internes'
  },
  adminNotes: {
    type: String,
    description: 'Notes administrateur'
  },
  // Détails de l'itinéraire
  routeDetails: {
    distance: {
      value: {
        type: Number,
        description: 'Distance en mètres'
      },
      text: {
        type: String,
        description: 'Distance formatée (ex: "15.5 km")'
      },
    },
    duration: {
      value: {
        type: Number,
        description: 'Durée en secondes'
      },
      text: {
        type: String,
        description: 'Durée formatée (ex: "25 min")'
      },
    },
    polyline: {
      type: String,
      description: 'Polyline encodé Google Maps pour affichage'
    },
  },
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
    description: 'Timestamp quand la course commence'
  },
  completedAt: {
    type: Date,
    description: 'Timestamp quand la course se termine'
  },
});

// Index pour améliorer les performances des requêtes
BookingSchema.index({ status: 1 });
BookingSchema.index({ pickupDateTime: 1 });
BookingSchema.index({ 'price.tariffApplied': 1 });
BookingSchema.index({ 'customerInfo.email': 1 });
BookingSchema.index({ createdAt: -1 });

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

// Méthode virtuelle pour calculer la durée de la course
BookingSchema.virtual('tripDuration').get(function() {
  if (this.startedAt && this.completedAt) {
    return this.completedAt - this.startedAt;
  }
  return null;
});

// Méthode virtuelle pour obtenir le nom complet du tarif
BookingSchema.virtual('fullTariffName').get(function() {
  const tariffNames = {
    'A': 'Tarif A - Course de jour avec retour en charge',
    'B': 'Tarif B - Course de nuit/weekend avec retour en charge',
    'C': 'Tarif C - Course de jour avec retour à vide',
    'D': 'Tarif D - Course de nuit/weekend avec retour à vide'
  };
  return tariffNames[this.price?.tariffApplied] || 'Tarif non défini';
});

// Méthode pour vérifier si la course est terminée
BookingSchema.methods.isCompleted = function() {
  return this.status === 'completed';
};

// Méthode pour obtenir le prix total formaté
BookingSchema.methods.getFormattedPrice = function() {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: this.price.currency || 'EUR'
  }).format(this.price.amount);
};

// NOUVELLE MÉTHODE : Obtenir la fourchette de prix formatée
BookingSchema.methods.getFormattedPriceRange = function() {
  if (!this.price.priceRange) return null;
  
  const min = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: this.price.currency || 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(this.price.priceRange.min);
  
  const max = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: this.price.currency || 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(this.price.priceRange.max);
  
  return `${min} - ${max}`;
};

// NOUVELLE MÉTHODE : Obtenir le prix effectif (final ou max de la fourchette)
BookingSchema.methods.getEffectivePrice = function() {
  return this.price.finalPrice || this.price.amount;
};

// NOUVELLE MÉTHODE : Mettre à jour le prix final
BookingSchema.methods.setFinalPrice = function(finalPrice) {
  if (!this.price.priceRange) {
    throw new Error('Aucune fourchette de prix définie');
  }
  
  if (finalPrice < this.price.priceRange.min || finalPrice > this.price.priceRange.max) {
    throw new Error(`Le prix final doit être entre ${this.price.priceRange.min}€ et ${this.price.priceRange.max}€`);
  }
  
  this.price.finalPrice = finalPrice;
  return this.save();
};

// NOUVELLE MÉTHODE : Vérifier si le prix est dans la fourchette
BookingSchema.methods.isPriceInRange = function(price) {
  if (!this.price.priceRange) return true;
  return price >= this.price.priceRange.min && price <= this.price.priceRange.max;
};

// NOUVELLE MÉTHODE : Obtenir le supplément VAN
BookingSchema.methods.getVanSupplement = function() {
  if (this.vehicleType === 'van') {
    // Le supplément VAN est de 15€
    return 15;
  }
  return 0;
};

// Assurer que les virtuals sont inclus lors de la conversion en JSON
BookingSchema.set('toJSON', { virtuals: true });
BookingSchema.set('toObject', { virtuals: true });

// Vérifier si le modèle existe déjà pour éviter les erreurs en développement avec hot-reload
export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);