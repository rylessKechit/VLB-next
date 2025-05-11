"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faCalendarAlt, 
  faFilter, 
  faSearch, 
  faSpinner, 
  faExclamationTriangle,
  faEye,
  faCheckCircle,
  faTimesCircle,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import BookingStatusBadge from '@/components/admin/BookingStatusBadge';

export default function BookingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const bookingsPerPage = 10;
  
  // État pour les filtres
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  
  // Récupérer les réservations
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Construire l'URL avec les paramètres de requête
        let url = `/api/bookings?skip=${(currentPage - 1) * bookingsPerPage}&limit=${bookingsPerPage}`;
        
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        
        // Ajouter la plage de dates si définie
        if (dateRange.startDate) {
          url += `&startDate=${dateRange.startDate}`;
        }
        
        if (dateRange.endDate) {
          url += `&endDate=${dateRange.endDate}`;
        }
        
        // Ajouter la recherche si elle existe
        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }
        
        console.log("Requête URL:", url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erreur serveur:", errorData);
          throw new Error(`Erreur lors de la récupération des réservations: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Données reçues:", data);
        
        if (!data.success) {
          throw new Error(data.error || "Erreur inconnue");
        }
        
        setBookings(data.data);
        setTotalBookings(data.meta.total);
        setTotalPages(Math.ceil(data.meta.total / bookingsPerPage));
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [currentPage, statusFilter, searchTerm, dateRange]);
  
  // Fonction pour changer le statut d'une réservation
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // Vérifier que l'ID est défini
      if (!bookingId) {
        alert('ID de réservation manquant');
        return;
      }
      
      // Confirmation pour certains changements de statut
      if (newStatus === 'in_progress') {
        if (!confirm('Êtes-vous sûr de vouloir démarrer cette course ?')) {
          return;
        }
      } else if (newStatus === 'completed') {
        if (!confirm('Êtes-vous sûr de marquer cette course comme terminée ?')) {
          return;
        }
      } else if (newStatus === 'cancelled') {
        if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
          return;
        }
      }
      
      const response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
      
      // Mettre à jour l'état des réservations
      setBookings(bookings.map(booking => 
        (booking._id === bookingId || booking.bookingId === bookingId)
          ? { ...booking, status: newStatus }
          : booking
      ));
      
      // Message de confirmation
      let message = '';
      switch(newStatus) {
        case 'confirmed':
          message = 'La réservation a été confirmée avec succès.';
          break;
        case 'in_progress':
          message = 'La course a été démarrée avec succès.';
          break;
        case 'completed':
          message = 'La course a été marquée comme terminée.';
          break;
        case 'cancelled':
          message = 'La réservation a été annulée.';
          break;
        default:
          message = 'Le statut a été mis à jour avec succès.';
      }
      
      // Afficher une notification
      alert(message);
    } catch (error) {
      console.error('Erreur:', error);
      // Afficher un message d'erreur à l'utilisateur
      alert('Erreur lors de la mise à jour du statut. Veuillez réessayer.');
    }
  };
  
  // Fonction pour formater la date et heure
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Non spécifié';
    
    const date = new Date(dateString);
    
    // Formater la date
    const dateFormatted = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    // Formater l'heure
    const timeFormatted = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${dateFormatted} ${timeFormatted}`;
  };
  
  // Fonction pour formater l'adresse
  const truncateAddress = (address, maxLength = 30) => {
    if (!address) return '';
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  };
  
  // Fonction pour changer de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Fonction pour gérer la soumission du formulaire de recherche
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');
    const status = formData.get('status');
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    
    setSearchTerm(search);
    setStatusFilter(status);
    setDateRange({ startDate, endDate });
    setCurrentPage(1); // Revenir à la première page lors d'une nouvelle recherche
  };
  
  // Fonction pour réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateRange({ startDate: '', endDate: '' });
    setCurrentPage(1);
    document.getElementById('searchForm').reset();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Gestion des réservations</h2>
        <div className="flex space-x-4">
          <Link 
            href="/admin/bookings/new" 
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center hover:bg-primary-dark transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nouvelle réservation
          </Link>
          <Link 
            href="/admin/planning" 
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md flex items-center hover:bg-gray-50 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            Planning
          </Link>
        </div>
      </div>
      
      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-4">
        <form id="searchForm" onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Nom, email, adresse..."
                defaultValue={searchTerm}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              defaultValue={statusFilter}
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <div className="flex space-x-2">
              <input
                type="date"
                name="startDate"
                id="startDate"
                className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                defaultValue={dateRange.startDate}
              />
              <input
                type="date"
                name="endDate"
                id="endDate"
                className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                defaultValue={dateRange.endDate}
              />
            </div>
          </div>
          
          <div className="flex items-end space-x-2">
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Filtrer
            </button>
            <button 
              type="button" 
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
      
      {/* Tableau des réservations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-primary text-3xl" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-12 text-red-500">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            <span>{error}</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune réservation trouvée</h3>
            <p>Essayez de modifier vos filtres ou de créer une nouvelle réservation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trajet
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id || booking.bookingId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.bookingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.customerInfo?.name}</div>
                      <div className="text-sm text-gray-500">{booking.customerInfo?.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(booking.pickupDateTime)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{truncateAddress(booking.pickupAddress)}</div>
                      <div className="text-sm text-gray-500">{truncateAddress(booking.dropoffAddress)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <BookingStatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link href={`/admin/bookings/${booking._id || booking.bookingId}`} className="text-indigo-600 hover:text-indigo-900">
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          Voir
                        </Link>
                        
                        {booking.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusChange(booking._id || booking.bookingId, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                            Confirmer
                          </button>
                        )}
                        
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button 
                            onClick={() => handleStatusChange(booking._id || booking.bookingId, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && !error && bookings.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{(currentPage - 1) * bookingsPerPage + 1}</span> à <span className="font-medium">{Math.min(currentPage * bookingsPerPage, totalBookings)}</span> sur <span className="font-medium">{totalBookings}</span> réservations
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Précédent</span>
                    <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-primary border-primary text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Suivant</span>
                    <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}