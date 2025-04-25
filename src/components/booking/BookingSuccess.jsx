"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BookingSuccess = ({ bookingData }) => {
  const [showPrintVersion, setShowPrintVersion] = useState(false);

  // Formatage de la date et l'heure pour l'affichage
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Non spécifié';
    
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatage du prix
  const formatPrice = (price) => {
    if (!price) return '0,00 €';
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: price.currency || 'EUR'
    }).format(price.amount);
  };

  // Fonction pour générer QR code (simulée)
  const getQRCodeUrl = (bookingId) => {
    return `/api/qr-code/${bookingId}`;
  };

  // Fonction pour afficher la version imprimable
  const handlePrint = () => {
    setShowPrintVersion(true);
    setTimeout(() => {
      window.print();
      setShowPrintVersion(false);
    }, 300);
  };

  return (
    <div className={`bg-white rounded-lg shadow-custom p-6 ${showPrintVersion ? 'print-version' : ''}`}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Réservation confirmée !</h2>
        
        <p className="text-gray-600 mb-4 max-w-lg mx-auto">
          Merci pour votre réservation. Votre chauffeur est informé et vous contactera prochainement.
        </p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">Référence de réservation</h3>
          <div className="text-2xl font-mono font-bold bg-gray-100 inline-block px-4 py-2 rounded-md">
            {bookingData.id || 'En attente'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations du trajet</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500 block">Date et heure:</span>
                <span className="font-medium">{formatDateTime(bookingData.pickupDateTime)}</span>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block">Départ:</span>
                <span className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {bookingData.pickupAddress}
                </span>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 block">Destination:</span>
                <span className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {bookingData.dropoffAddress}
                </span>
              </div>
              
              {bookingData.flightNumber && (
                <div>
                  <span className="text-sm text-gray-500 block">Numéro de vol:</span>
                  <span className="font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 00-.29-.715l-2.99-2.99a1 1 0 01.374-1.639l.089-.035a1 1 0 01.486-.096l5.62.623a1 1 0 00.987-.45l.058-.11a1 1 0 00-.073-1.118l-2.08-2.08a1 1 0 01-.267-.56L10.894 2.553z" />
                    </svg>
                    {bookingData.flightNumber}
                  </span>
                </div>
              )}
              
              {bookingData.trainNumber && (
                <div>
                  <span className="text-sm text-gray-500 block">Numéro de train:</span>
                  <span className="font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                    </svg>
                    {bookingData.trainNumber}
                  </span>
                </div>
              )}
              
              {bookingData.roundTrip && (
                <div>
                  <span className="text-sm text-gray-500 block">Retour:</span>
                  <span className="font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {formatDateTime(bookingData.returnDateTime)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Votre véhicule</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center">
              <div className="mr-4 bg-gray-100 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2a2 2 0 00.5-3.932l-1.144-4.57a2 2 0 00-1.942-1.498H5.372a2 2 0 00-1.928 1.584l-.857 4.287A1 1 0 002 6h1v9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Véhicule de qualité</h4>
                <p className="text-sm text-gray-600 mb-2">Véhicule spacieux et confortable</p>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    {bookingData.passengers} passagers
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    {bookingData.luggage} bagages
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-4">Prix et paiement</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <span className="font-medium">Prix total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(bookingData.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Paiement auprès du chauffeur</span>
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-4">Contact chauffeur</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Le chauffeur vous contactera peu avant votre prise en charge.
              </p>
              <div className="text-sm text-gray-600">
                <span>Pour toute question, contactez notre service client :</span>
                <a href="tel:+33600000000" className="block mt-2 text-primary font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  +33 6 00 00 00 00
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        <button 
          onClick={handlePrint} 
          className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-5 8H6v2h2v-2zm0-4H4v3h4V8zm5 4h2v2h-2v-2zm0-4h4v3h-4V8z" clipRule="evenodd" />
          </svg>
          Imprimer la confirmation
        </button>
        
        <Link 
          href="/" 
          className="py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>
      
      <div className="mt-10">
        <h4 className="text-lg font-semibold mb-4">Complétez votre expérience</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-3">
              <div className="bg-primary-light rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h5 className="font-medium">Siège enfant</h5>
            </div>
            <p className="text-sm text-gray-600 mb-3">Siège adapté pour les enfants de moins de 10 ans</p>
            <button className="text-primary text-sm font-medium hover:text-primary-dark transition-colors duration-300">
              Ajouter (+5€)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;