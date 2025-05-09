// src/app/admin/planning/page.js - Mise à jour sans filtrage par chauffeur

"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faCalendarCheck, 
  faFilter,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import BookingCalendar from '@/components/admin/BookingCalendar';

export default function PlanningPage() {
  const { data: session } = useSession();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Planning des courses</h2>
        <div className="flex space-x-4">
          <Link 
            href="/admin/bookings/new" 
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center hover:bg-primary-dark transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nouvelle réservation
          </Link>
          <Link 
            href="/admin/bookings" 
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md flex items-center hover:bg-gray-50 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
            Liste des réservations
          </Link>
        </div>
      </div>
      
      {/* Options de filtrage simplifiées */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faFilter} className="text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700">Filtres :</span>
          
          <div className="ml-4">
            <select 
              className="rounded-md border-gray-300 text-sm focus:ring-primary focus:border-primary"
              defaultValue="all"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmés</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminés</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Calendrier des réservations */}
      <BookingCalendar />
    </div>
  );
}