"use client";

import { useEffect, useRef, useState } from 'react';

const RouteMap = ({ pickupAddress, dropoffAddress, pickupPlaceId, dropoffPlaceId, polyline }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  
  // Charger le script Google Maps avec les bibliothèques minimales nécessaires
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        return;
      }
      
      if (window.googleMapsLoading) return;
      window.googleMapsLoading = true;
      
      window.initMap = () => {
        window.googleMapsLoading = false;
        setMapLoaded(true);
      };
      
      const script = document.createElement('script');
      const apiKey = process.env.NEXT_PUBLIC_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      // Charger uniquement les bibliothèques nécessaires
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places,geometry&v=weekly&loading=async`;
      script.async = true;
      script.defer = true;
      
      document.head.appendChild(script);
    };
    
    loadGoogleMapsScript();
    
    // Nettoyage lors du démontage
    return () => {
      // Supprimer les écouteurs d'événements si la carte a été créée
      if (map) {
        window.google?.maps?.event.clearInstanceListeners(map);
      }
    };
  }, []);
  
  // Initialiser la carte quand le script est chargé
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    const initializeMap = async () => {
      // Personnalisation du style de la carte pour correspondre à votre thème
      const mapStyles = [
        {
          "featureType": "all",
          "elementType": "geometry.fill",
          "stylers": [{ "lightness": "0" }, { "gamma": "1" }]
        },
        {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [{ "visibility": "simplified" }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [{ "color": "#f5f5f5" }]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.icon",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "transit.station",
          "elementType": "labels.icon",
          "stylers": [{ "visibility": "simplified" }]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{ "color": "#a3ccff" }, { "visibility": "on" }]
        }
      ];
      
      // Créer une nouvelle carte avec options minimales
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: 48.7465, lng: 2.2539 }, // Coordonnées centrales de Verrières-le-Buisson
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
        styles: mapStyles,
        disableDefaultUI: true,
        scrollwheel: false,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM
        }
      });
      
      setMap(mapInstance);
      
      // Si nous avons déjà les identifiants de lieu, nous pouvons afficher la route
      if (pickupPlaceId && dropoffPlaceId) {
        displayRoute(mapInstance, pickupPlaceId, dropoffPlaceId, polyline);
      } else if (pickupAddress && dropoffAddress) {
        // Sinon, convertir les adresses en coordonnées
        const geocoder = new window.google.maps.Geocoder();
        
        try {
          // Obtenir les coordonnées du point de départ
          const pickupResults = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: pickupAddress }, (results, status) => {
              if (status === 'OK') resolve(results[0]);
              else reject(status);
            });
          });
          
          // Obtenir les coordonnées du point d'arrivée
          const dropoffResults = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: dropoffAddress }, (results, status) => {
              if (status === 'OK') resolve(results[0]);
              else reject(status);
            });
          });
          
          // Calculer et afficher l'itinéraire avec options minimales
          const directionsService = new window.google.maps.DirectionsService();
          const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map: mapInstance,
            suppressMarkers: true, // On va créer nos propres marqueurs personnalisés
            polylineOptions: {
              strokeColor: '#d4af37', // Couleur primaire de votre thème (dorée)
              strokeWeight: 5,
              strokeOpacity: 0.8
            }
          });
          
          const result = await new Promise((resolve, reject) => {
            directionsService.route({
              origin: pickupResults.geometry.location,
              destination: dropoffResults.geometry.location,
              travelMode: window.google.maps.TravelMode.DRIVING,
              optimizeWaypoints: false,
              provideRouteAlternatives: false,
              avoidFerries: true,
              avoidHighways: false,
              avoidTolls: false,
            }, (response, status) => {
              if (status === 'OK') resolve(response);
              else reject(status);
            });
          });
          
          directionsRenderer.setDirections(result);
          
          // Ajouter des marqueurs personnalisés
          addCustomMarker(mapInstance, pickupResults.geometry.location, 'A', 'Départ');
          addCustomMarker(mapInstance, dropoffResults.geometry.location, 'B', 'Arrivée');
          
          // Ajuster la vue pour voir l'ensemble de l'itinéraire
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(pickupResults.geometry.location);
          bounds.extend(dropoffResults.geometry.location);
          mapInstance.fitBounds(bounds);
          
        } catch (error) {
          console.error("Erreur lors de l'affichage de l'itinéraire:", error);
          
          // Fallback: Afficher juste des marqueurs pour le départ et l'arrivée
          try {
            addCustomMarker(mapInstance, { lat: 48.7465, lng: 2.2539 }, 'A', 'Départ');
            addCustomMarker(mapInstance, { lat: 48.8566, lng: 2.3522 }, 'B', 'Arrivée');
            
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend({ lat: 48.7465, lng: 2.2539 });
            bounds.extend({ lat: 48.8566, lng: 2.3522 });
            mapInstance.fitBounds(bounds);
          } catch (markerError) {
            console.error("Impossible d'afficher les marqueurs:", markerError);
          }
        }
      }
    };
    
    initializeMap();
  }, [mapLoaded, pickupAddress, dropoffAddress, pickupPlaceId, dropoffPlaceId, polyline]);
  
  // Fonction pour ajouter des marqueurs personnalisés avec le style de votre application
  const addCustomMarker = (mapInstance, position, label, title) => {
    const backgroundColor = label === 'A' ? '#d4af37' : '#2a5a9e'; // Utiliser les couleurs primaire et secondaire de votre thème
    
    new window.google.maps.Marker({
      position: position,
      map: mapInstance,
      label: {
        text: label,
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold'
      },
      title: title,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: backgroundColor,
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 2,
        scale: 12
      },
      animation: window.google.maps.Animation.DROP,
      zIndex: 10
    });
  };
  
  // Fonction pour afficher l'itinéraire à partir des identifiants de lieu
  const displayRoute = (mapInstance, originPlaceId, destinationPlaceId, encodedPolyline) => {
    if (encodedPolyline && window.google.maps.geometry) {
      // Si nous avons un polyline encodé, l'utiliser
      try {
        const decodedPath = window.google.maps.geometry.encoding.decodePath(encodedPolyline);
        
        new window.google.maps.Polyline({
          path: decodedPath,
          geodesic: true,
          strokeColor: '#d4af37', // Couleur primaire de votre thème
          strokeOpacity: 0.8,
          strokeWeight: 5,
          map: mapInstance
        });
        
        // Ajouter des marqueurs personnalisés pour les points de départ et d'arrivée
        if (decodedPath.length > 0) {
          const startPoint = decodedPath[0];
          const endPoint = decodedPath[decodedPath.length - 1];
          
          addCustomMarker(mapInstance, startPoint, 'A', 'Départ');
          addCustomMarker(mapInstance, endPoint, 'B', 'Arrivée');
          
          // Ajuster la vue
          const bounds = new window.google.maps.LatLngBounds();
          decodedPath.forEach(point => bounds.extend(point));
          mapInstance.fitBounds(bounds);
        }
        
        return;
      } catch (error) {
        console.error("Erreur lors du décodage du polyline:", error);
        // Continuer avec l'autre méthode si le décodage échoue
      }
    }
    
    // Utiliser le service Directions avec options minimales
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: mapInstance,
      suppressMarkers: true, // On va créer nos propres marqueurs personnalisés
      polylineOptions: {
        strokeColor: '#d4af37', // Couleur primaire de votre thème
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    });
    
    directionsService.route({
      origin: { placeId: originPlaceId },
      destination: { placeId: destinationPlaceId },
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
      provideRouteAlternatives: false,
      avoidFerries: true,
      avoidHighways: false,
      avoidTolls: false,
    }, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
        
        // Ajouter des marqueurs personnalisés
        const route = response.routes[0].legs[0];
        addCustomMarker(mapInstance, route.start_location, 'A', 'Départ');
        addCustomMarker(mapInstance, route.end_location, 'B', 'Arrivée');
      } else {
        console.error("Erreur lors du calcul de l'itinéraire:", status);
      }
    });
  };
  
  return (
    <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-custom">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ display: mapLoaded ? 'block' : 'none' }}
        aria-label="Carte montrant l'itinéraire du trajet"
        role="application"
      ></div>
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 px-2 py-1 rounded-md text-xs">
        <p className="text-gray-600">Itinéraire approximatif</p>
      </div>
    </div>
  );
};

export default RouteMap;