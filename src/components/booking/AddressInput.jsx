"use client";

import { useState, useEffect, useRef } from 'react';

const AddressInput = ({ id, value, onChange, onSelect, placeholder, label }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Charger le script Google Maps si nécessaire
  useEffect(() => {
    // Variable pour suivre si le composant est toujours monté
    let isMounted = true;
    
    const loadGoogleMapsScript = () => {
      // Vérifier si l'API est déjà chargée
      if (window.google && window.google.maps && window.google.maps.places) {
        if (isMounted) {
          setIsLoaded(true);
        }
        return;
      }
      
      // Vérifier si le script est déjà en cours de chargement
      if (window.googleMapsScriptLoading) {
        // Attendre que le script soit chargé
        const checkLoaded = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(checkLoaded);
            if (isMounted) {
              setIsLoaded(true);
            }
          }
        }, 100);
        return;
      }
      
      // Marquer le script comme en cours de chargement
      window.googleMapsScriptLoading = true;
      
      // Créer une fonction de callback globale
      window.initGoogleMapsAutocomplete = () => {
        window.googleMapsScriptLoading = false;
        if (isMounted) {
          setIsLoaded(true);
        }
      };
      
      // Charger le script
      setIsLoading(true);
      const script = document.createElement('script');
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsAutocomplete&loading=async`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        if (isMounted) {
          console.error('Erreur lors du chargement de l\'API Google Maps');
          setIsLoading(false);
        }
        window.googleMapsScriptLoading = false;
      };
      
      document.head.appendChild(script);
    };
    
    loadGoogleMapsScript();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);
  
  // Initialiser l'autocomplete quand l'API est chargée
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      try {
        // Créer l'autocomplete
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'fr' },
          fields: ['address_components', 'formatted_address', 'place_id', 'geometry']
        });
        
        // Ajouter l'événement de sélection
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place && place.place_id) {
            onChange(place.formatted_address || '');
            onSelect(place.formatted_address || '', place.place_id);
          }
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'autocomplete:', error);
        setIsLoading(false);
      }
    }
  }, [isLoaded, id, onChange, onSelect]);
  
  // Obtenir le texte de l'étiquette à partir du placeholder si aucun n'est fourni
  const labelText = label || placeholder;
  const describedById = `${id}-help`;
  
  return (
    <div className={`relative ${isLoading ? 'loading' : ''}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {labelText} {labelText.includes('*') ? '' : <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </span>
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          aria-describedby={describedById}
          aria-required="true"
          aria-autocomplete="list"
          role="combobox"
          aria-expanded={!!value}
          autoComplete="street-address"
          required
        />
        {isLoading && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3" aria-hidden="true">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="sr-only">Chargement...</span>
          </span>
        )}
      </div>
      <div id={describedById} className="mt-1 text-xs text-gray-500">
        Saisissez une adresse et sélectionnez une suggestion dans la liste
      </div>
    </div>
  );
};

export default AddressInput;