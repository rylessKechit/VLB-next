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

      {/* Composant BookingForm avec configuration admin */}
      <div className="max-w-4xl mx-auto">
        <BookingForm {...adminConfig} />
      </div>
    </div>
  );
};

export default AdminBookingForm;