"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BookingForm from '@/components/booking/BookingForm';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUserShield } from '@fortawesome/free-solid-svg-icons';

const AdminBookingForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Configuration spéciale pour l'admin
  const adminConfig = {
    isAdminContext: true,
    showPriceRange: true,
    autoConfirm: true, // Les réservations admin sont automatiquement confirmées
    onSuccess: (result) => {
      // Rediriger vers la page de détail de la réservation
      router.push(`/admin/bookings/${result.id}`);
    },
    onError: (error) => {
      console.error('Erreur création réservation admin:', error);
    }
  };

  return (
    <div className="pb-4">
      {/* Header mobile avec indication admin */}
      <div className="flex items-center mb-6">
        <Link 
          href="/admin/bookings"
          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg mr-3"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">Nouvelle réservation</h1>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <FontAwesomeIcon icon={faUserShield} className="h-4 w-4 mr-2 text-primary" />
            <span>Création par l'administrateur</span>
          </div>
        </div>
      </div>

      {/* Note d'information pour l'admin */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Réservation administrative</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>La réservation sera automatiquement confirmée</li>
              <li>Vous pourrez ajuster le prix final dans les détails</li>
              <li>Les emails de confirmation seront envoyés automatiquement</li>
              <li>Vous pouvez saisir les adresses manuellement ou utiliser l'autocomplétion</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Composant BookingForm avec configuration admin */}
      <div className="max-w-4xl mx-auto">
        <BookingForm {...adminConfig} />
      </div>
    </div>
  );
};

export default AdminBookingForm;