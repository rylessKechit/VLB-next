"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faEdit, 
  faTrash, 
  faCheckCircle, 
  faTimesCircle,
  faSpinner,
  faExclamationCircle,
  faUser,
  faMapMarkerAlt,
  faClock,
  faUsers,
  faSuitcase,
  faPlane,
  faTrain,
  faStickyNote,
  faEuroSign,
  faEnvelope,
  faPhone,
  faPlus,
  faCircleDot
} from '@fortawesome/free-solid-svg-icons';
import BookingStatusBadge from '@/components/admin/BookingStatusBadge';
import RouteMap from '@/components/booking/RouteMap';

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Récupérer les détails de la réservation
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        // Vérifier que l'ID est défini
        if (!id) {
          setError('ID de réservation manquant');
          setLoading(false);
          return;
        }
        
        const response = await fetch(`/api/bookings/${encodeURIComponent(id)}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails de la réservation');
        }
        
        const data = await response.json();
        setBooking(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [id]);
  
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
  
  // Fonction pour formater le prix
  const formatPrice = (price) => {
    if (!price) return '0,00 €';
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: price.currency || 'EUR'
    }).format(price.amount);
  };
  
  // Fonction pour changer le statut d'une réservation
  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      
      // Vérifier que l'ID est défini
      if (!id) {
        alert('ID de réservation manquant');
        setActionLoading(false);
        return;
      }
      
      // Confirmation pour certains changements de statut
      if (newStatus === 'in_progress') {
        if (!confirm('Êtes-vous sûr de vouloir démarrer cette course ?')) {
          setActionLoading(false);
          return;
        }
      } else if (newStatus === 'completed') {
        if (!confirm('Êtes-vous sûr de marquer cette course comme terminée ?')) {
          setActionLoading(false);
          return;
        }
      } else if (newStatus === 'cancelled') {
        if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
          setActionLoading(false);
          return;
        }
      }
      
      const response = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
      
      const data = await response.json();
      setBooking(data.data);
      
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
      
      setActionLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setActionLoading(false);
      // Afficher un message d'erreur à l'utilisateur
      alert('Erreur lors de la mise à jour du statut. Veuillez réessayer.');
    }
  };
  
  // Fonction pour supprimer une réservation
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation?')) {
      try {
        setActionLoading(true);
        
        const response = await fetch(`/api/bookings/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }
        
        // Rediriger vers la page des réservations
        router.push('/admin/bookings');
      } catch (error) {
        console.error('Erreur:', error);
        setActionLoading(false);
        // Afficher un message d'erreur à l'utilisateur
        alert('Erreur lors de la suppression de la réservation. Veuillez réessayer.');
      }
    }
  };
  
  // Fonction pour assigner un chauffeur à une réservation
  const handleAssignDriver = async (driverId) => {
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedDriver: driverId }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'assignation du chauffeur');
      }
      
      const data = await response.json();
      setBooking(data.data);
      setActionLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setActionLoading(false);
      // Afficher un message d'erreur à l'utilisateur
      alert('Erreur lors de l\'assignation du chauffeur. Veuillez réessayer.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FontAwesomeIcon icon={faSpinner} spin className="h-8 w-8 text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <FontAwesomeIcon icon={faExclamationCircle} className="h-16 w-16 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Erreur</h3>
        <p>{error}</p>
        <Link 
          href="/admin/bookings" 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-300"
        >
          Retour aux réservations
        </Link>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <FontAwesomeIcon icon={faExclamationCircle} className="h-16 w-16 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Réservation non trouvée</h3>
        <p>La réservation que vous recherchez n'existe pas ou a été supprimée.</p>
        <Link 
          href="/admin/bookings" 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-300"
        >
          Retour aux réservations
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            href="/admin/bookings" 
            className="mr-4 text-gray-600 hover:text-primary transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
          </Link>
          <h2 className="text-xl font-bold text-gray-800">
            Détails de la réservation {booking.bookingId}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Link 
            href={`/admin/bookings/${id}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Modifier
          </Link>
          {booking.status === 'pending' && (
            <button
              onClick={() => handleStatusChange('confirmed')}
              disabled={actionLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Confirmer
            </button>
          )}
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 flex items-center disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
              Annuler
            </button>
          )}
          {session?.user?.role === 'admin' && (
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 flex items-center disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Supprimer
            </button>
          )}
        </div>
      </div>
      
      {/* Carte et informations de statut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Itinéraire</h3>
            <div className="h-64">
              <RouteMap 
                pickupAddress={booking.pickupAddress}
                dropoffAddress={booking.dropoffAddress}
                pickupPlaceId={booking.pickupAddressPlaceId}
                dropoffPlaceId={booking.dropoffAddressPlaceId}
                polyline={booking.polyline}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Statut</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="inline-block">
                <BookingStatusBadge status={booking.status} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faClock} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Créée le</p>
                  <p className="text-sm font-medium">{formatDateTime(booking.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faEuroSign} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prix</p>
                  <p className="text-lg font-bold text-primary">{formatPrice(booking.price)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Détails de la réservation */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Détails de la réservation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3 mt-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse de départ</p>
                  <p className="text-base font-medium">{booking.pickupAddress}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3 mt-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse d'arrivée</p>
                  <p className="text-base font-medium">{booking.dropoffAddress}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3 mt-1">
                  <FontAwesomeIcon icon={faClock} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date et heure de départ</p>
                  <p className="text-base font-medium">{formatDateTime(booking.pickupDateTime)}</p>
                </div>
              </div>
              
              {booking.roundTrip && booking.returnDateTime && (
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3 mt-1">
                    <FontAwesomeIcon icon={faClock} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date et heure de retour</p>
                    <p className="text-base font-medium">{formatDateTime(booking.returnDateTime)}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3 mt-1">
                  <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passagers</p>
                  <p className="text-base font-medium">{booking.passengers}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3 mt-1">
                  <FontAwesomeIcon icon={faSuitcase} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bagages</p>
                  <p className="text-base font-medium">{booking.luggage}</p>
                </div>
              </div>
              
              {booking.flightNumber && (
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3 mt-1">
                    <FontAwesomeIcon icon={faPlane} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Numéro de vol</p>
                    <p className="text-base font-medium">{booking.flightNumber}</p>
                  </div>
                </div>
              )}
              
              {booking.trainNumber && (
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3 mt-1">
                    <FontAwesomeIcon icon={faTrain} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Numéro de train</p>
                    <p className="text-base font-medium">{booking.trainNumber}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-3 mt-1">
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="text-base font-medium">{booking.customerInfo?.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-3 mt-1">
                  <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-base font-medium">{booking.customerInfo?.email}</p>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-3 mt-1">
                  <FontAwesomeIcon icon={faPhone} className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <div className="flex items-center">
                    <a 
                      href={`tel:${booking.customerInfo?.phone}`}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 inline-flex items-center text-sm"
                    >
                      <FontAwesomeIcon icon={faPhone} className="mr-2" />
                      {booking.customerInfo?.phone}
                    </a>
                  </div>
                </div>
              </div>
              
              {booking.specialRequests && (
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3 mt-1">
                    <FontAwesomeIcon icon={faStickyNote} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Demandes spéciales</p>
                    <p className="text-base">{booking.specialRequests}</p>
                  </div>
                </div>
              )}
              
              {session?.user?.role === 'admin' && (
                <div className="mt-6">
                  <h4 className="text-base font-semibold mb-3">Notes administratives</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {booking.adminNotes ? (
                      <p className="text-sm">{booking.adminNotes}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Aucune note administrative</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      const newNotes = prompt('Notes administratives:', booking.adminNotes || '');
                      
                      if (newNotes !== null) {
                        fetch(`/api/bookings/${id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ adminNotes: newNotes }),
                        })
                          .then(response => {
                            if (!response.ok) throw new Error('Erreur lors de la mise à jour des notes');
                            return response.json();
                          })
                          .then(data => {
                            setBooking(data.data);
                          })
                          .catch(error => {
                            console.error('Erreur:', error);
                            alert('Erreur lors de la mise à jour des notes. Veuillez réessayer.');
                          });
                      }
                    }}
                    className="mt-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-300"
                  >
                    {booking.adminNotes ? 'Modifier les notes' : 'Ajouter des notes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Historique des modifications */}
      {session?.user?.role === 'admin' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Historique</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-3 z-10">
                    <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                  </div>
                  <div className="absolute top-10 bottom-0 left-5 w-0.5 bg-gray-200 -z-10"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Réservation créée</p>
                  <p className="text-xs text-gray-500">{formatDateTime(booking.createdAt)}</p>
                </div>
              </div>
              
              {booking.status !== 'pending' && (
                <div className="flex items-start">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 z-10 
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-500' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-500' : 
                        'bg-blue-100 text-blue-500'}`}>
                      <FontAwesomeIcon 
                        icon={
                          booking.status === 'confirmed' ? faCheckCircle : 
                          booking.status === 'cancelled' ? faTimesCircle : 
                          faCheck
                        } 
                        className="h-5 w-5" 
                      />
                    </div>
                    <div className="absolute top-10 bottom-0 left-5 w-0.5 bg-gray-200 -z-10"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Statut modifié: <BookingStatusBadge status={booking.status} />
                    </p>
                    <p className="text-xs text-gray-500">{formatDateTime(booking.updatedAt)}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faCircleDot} className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Dernière mise à jour</p>
                  <p className="text-xs text-gray-500">{formatDateTime(booking.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}