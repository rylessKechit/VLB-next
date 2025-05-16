"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faSpinner,
  faUser,
  faMapMarkerAlt,
  faClock,
  faUsers,
  faSuitcase,
  faPlane,
  faTrain,
  faStickyNote,
  faEuroSign,
  faCheck,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

export default function NewBookingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Info client, 2: Trajet, 3: Détails, 4: Confirmation
  
  // États du formulaire
  const [formData, setFormData] = useState({
    // Informations client
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    
    // Détails du trajet
    pickupAddress: '',
    dropoffAddress: '',
    pickupDate: '',
    pickupTime: '',
    passengers: 1,
    luggage: 0,
    roundTrip: false,
    returnDate: '',
    returnTime: '',
    
    // Informations additionnelles
    flightNumber: '',
    trainNumber: '',
    specialRequests: '',
    vehicleType: 'berline', // green, berline, van
    
    // Prix (sera calculé)
    estimatedPrice: null
  });
  
  // Gérer les changements du formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Calculer le prix estimé (simple pour l'admin)
  const calculateEstimatedPrice = () => {
    // Prix de base selon le véhicule
    let basePrice = formData.vehicleType === 'green' ? 45 : 
                   formData.vehicleType === 'berline' ? 50 : 65;
    
    // Multiplier par 2 si aller-retour
    if (formData.roundTrip) {
      basePrice *= 2;
    }
    
    // Ajouter supplément pour bagages
    basePrice += formData.luggage * 5;
    
    setFormData(prev => ({ ...prev, estimatedPrice: basePrice }));
  };
  
  // Calculer le prix quand les détails changent
  useEffect(() => {
    if (formData.pickupAddress && formData.dropoffAddress) {
      calculateEstimatedPrice();
    }
  }, [formData.vehicleType, formData.roundTrip, formData.luggage]);
  
  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Préparer les données pour l'API
      const bookingData = {
        customerInfo: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone
        },
        pickupAddress: formData.pickupAddress,
        dropoffAddress: formData.dropoffAddress,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        passengers: parseInt(formData.passengers),
        luggage: parseInt(formData.luggage),
        roundTrip: formData.roundTrip,
        returnDate: formData.returnDate || null,
        returnTime: formData.returnTime || null,
        flightNumber: formData.flightNumber || null,
        trainNumber: formData.trainNumber || null,
        specialRequests: formData.specialRequests || null,
        vehicleType: formData.vehicleType,
        price: {
          amount: formData.estimatedPrice || 50,
          currency: 'EUR',
          priceRange: {
            min: formData.estimatedPrice ? formData.estimatedPrice - 10 : 40,
            max: formData.estimatedPrice ? formData.estimatedPrice + 10 : 60
          }
        },
        tariffApplied: 'A' // Tarif standard pour admin
      };
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la réservation');
      }
      
      const result = await response.json();
      setSuccess(true);
      
      // Rediriger vers la réservation créée après 2 secondes
      setTimeout(() => {
        router.push(`/admin/bookings/${result.data.id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Obtenir la date d'aujourd'hui pour le minimum
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  // Obtenir l'heure actuelle
  const getCurrentTime = () => {
    return new Date().toTimeString().slice(0, 5);
  };
  
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faCheck} className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Réservation créée !</h2>
          <p className="text-gray-600 mb-4">
            La réservation a été créée avec succès. Redirection en cours...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-4">
      {/* Header mobile */}
      <div className="flex items-center mb-6">
        <Link 
          href="/admin/bookings"
          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg mr-3"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Nouvelle réservation</h1>
      </div>
      
      {/* Indicateur de progression */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`h-1 w-8 sm:w-16 mx-2 ${
                  step > stepNumber ? 'bg-primary' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600 text-center">
          Étape {step} sur 4
        </div>
      </div>
      
      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Étape 1: Informations client */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-primary" />
              Informations client
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  placeholder="Ex: Jean Dupont"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  placeholder="jean.dupont@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Étape 2: Détails du trajet */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-primary" />
              Détails du trajet
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse de départ *
                </label>
                <input
                  type="text"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  placeholder="Ex: 123 Rue de la Paix, Verrières-le-Buisson"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse d'arrivée *
                </label>
                <input
                  type="text"
                  name="dropoffAddress"
                  value={formData.dropoffAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  placeholder="Ex: Aéroport Charles de Gaulle, Terminal 2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    required
                    min={getTodayDate()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  />
                </div>
              </div>
              
              {/* Aller-retour */}
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  name="roundTrip"
                  checked={formData.roundTrip}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-3 text-sm font-medium text-gray-700">
                  Aller-retour
                </label>
              </div>
              
              {/* Détails retour si aller-retour */}
              {formData.roundTrip && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de retour
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleInputChange}
                      min={formData.pickupDate || getTodayDate()}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de retour
                    </label>
                    <input
                      type="time"
                      name="returnTime"
                      value={formData.returnTime}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Étape 3: Détails supplémentaires */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Passagers et bagages */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FontAwesomeIcon icon={faUsers} className="mr-2 text-primary" />
                Passagers et bagages
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de passagers
                  </label>
                  <select
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de bagages
                  </label>
                  <select
                    name="luggage"
                    value={formData.luggage}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Type de véhicule */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Type de véhicule
              </h3>
              
              <div className="space-y-3">
                {[
                  { value: 'green', label: 'Tesla Model 3', desc: 'Électrique, 4 places' },
                  { value: 'berline', label: 'Mercedes Classe E', desc: 'Berline premium, 4 places' },
                  { value: 'van', label: 'Mercedes Classe V', desc: 'Van spacieux, 7 places' }
                ].map((vehicle) => (
                  <div key={vehicle.value} className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <input
                      type="radio"
                      name="vehicleType"
                      value={vehicle.value}
                      checked={formData.vehicleType === vehicle.value}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary focus:ring-primary"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{vehicle.label}</div>
                      <div className="text-sm text-gray-600">{vehicle.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Informations optionnelles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Informations optionnelles
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faPlane} className="mr-2 text-primary" />
                    Numéro de vol
                  </label>
                  <input
                    type="text"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    placeholder="Ex: AF1234"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faTrain} className="mr-2 text-primary" />
                    Numéro de train
                  </label>
                  <input
                    type="text"
                    name="trainNumber"
                    value={formData.trainNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    placeholder="Ex: TGV 8923"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faStickyNote} className="mr-2 text-primary" />
                    Demandes spéciales
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base resize-none"
                    placeholder="Toute demande particulière..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Étape 4: Confirmation */}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faCheck} className="mr-2 text-primary" />
              Récapitulatif
            </h2>
            
            <div className="space-y-4">
              {/* Client */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Client</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{formData.customerName}</div>
                  <div>{formData.customerEmail}</div>
                  <div>{formData.customerPhone}</div>
                </div>
              </div>
              
              {/* Trajet */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Trajet</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>De:</strong> {formData.pickupAddress}</div>
                  <div><strong>À:</strong> {formData.dropoffAddress}</div>
                  <div><strong>Date:</strong> {new Date(formData.pickupDate + 'T' + formData.pickupTime).toLocaleDateString('fr-FR')} à {formData.pickupTime}</div>
                  {formData.roundTrip && formData.returnDate && (
                    <div><strong>Retour:</strong> {new Date(formData.returnDate + 'T' + formData.returnTime).toLocaleDateString('fr-FR')} à {formData.returnTime}</div>
                  )}
                </div>
              </div>
              
              {/* Détails */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Détails</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{formData.passengers} passager{formData.passengers > 1 ? 's' : ''}</div>
                  <div>{formData.luggage} bagage{formData.luggage > 1 ? 's' : ''}</div>
                  <div>Véhicule: {
                    formData.vehicleType === 'green' ? 'Tesla Model 3' :
                    formData.vehicleType === 'berline' ? 'Mercedes Classe E' :
                    'Mercedes Classe V'
                  }</div>
                  {formData.flightNumber && <div>Vol: {formData.flightNumber}</div>}
                  {formData.trainNumber && <div>Train: {formData.trainNumber}</div>}
                </div>
              </div>
              
              {/* Prix estimé */}
              {formData.estimatedPrice && (
                <div className="p-3 bg-primary-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faEuroSign} className="mr-2 text-primary" />
                    Prix estimé
                  </h3>
                  <div className="text-2xl font-bold text-primary">
                    {formData.estimatedPrice}€
                  </div>
                  <div className="text-sm text-gray-600">
                    (Prix indicatif basé sur les informations fournies)
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Boutons de navigation */}
        <div className="flex justify-between space-x-4">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Précédent
            </button>
          )}
          
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && (!formData.customerName || !formData.customerEmail || !formData.customerPhone)) ||
                (step === 2 && (!formData.pickupAddress || !formData.dropoffAddress || !formData.pickupDate || !formData.pickupTime))
              }
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Création...
                </div>
              ) : (
                'Créer la réservation'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}