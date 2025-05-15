"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  useEffect(() => {
    // Marquer le composant comme chargé
    setIsLoaded(true);

    // Activer les animations après un court délai (seulement sur desktop)
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      const timer = setTimeout(() => {
        setAnimationsEnabled(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section 
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center text-white text-center overflow-hidden"
      style={{ 
        minHeight: 'calc(100vh - 0px)'
      }}
    >
      {/* Image d'arrière-plan chargée de manière optimisée */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/header-image.webp" 
          alt="Taxi Verrières-le-Buisson" 
          fill
          priority
          quality={75}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRoQAAABXRUJQVlA4IDgAAACQAQCdASoIAAMAAkA4JZQCdLoB+AAAPuhVgD67E1NpKfGLgX/yP+vvgnhNfBKo+hhSfCkMAAAA"
        />
        {/* Overlay semi-transparent pour assurer la lisibilité du texte */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
      </div>

      <div className="container relative z-20 px-4 max-w-5xl mx-auto">
        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${animationsEnabled ? 'animate-slide-in-left' : ''}`}>
          <span className="text-primary">TAXI VLB</span> 
          <span className="text-xl sm:text-2xl md:text-3xl block mt-2 text-primary">VERRIÈRES-LE-BUISSON</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl font-light mb-6">
          Service de taxi de qualité dans l'Essonne (91)
        </p>
        
        {/* Principal LCP - optimisé sans animation sur mobile */}
        <p className="text-base sm:text-lg max-w-3xl mx-auto mb-8 px-4">
          Taxi professionnel à votre service pour vos déplacements quotidiens, transferts aéroports (Orly, CDG), 
          gares parisiennes et voyages longue distance. Disponible 24h/24, 7j/7 à Verrières-le-Buisson et environs.
        </p>
        
        {/* Un seul bouton principal optimisé pour mobile */}
        <div className={`${animationsEnabled ? 'animate-fade-in' : ''}`}>
          <Link href="#booking" 
            className="inline-block w-full sm:w-auto min-w-[280px] sm:min-w-[320px] py-4 px-8 bg-primary text-white text-lg sm:text-xl font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            aria-label="Réserver un taxi à Verrières-le-Buisson"
          >
            Réserver maintenant
          </Link>
        </div>

        {/* Informations supplémentaires en dessous sur mobile */}
        <div className="mt-8 sm:mt-12 text-sm sm:text-base text-center text-gray-200">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-8">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              24h/24 - 7j/7
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Devis gratuit
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Chauffeur professionnel
            </span>
          </div>
        </div>
      </div>
      
      <Link 
        href="#services" 
        className={`absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 w-12 h-12 flex items-center justify-center rounded-full border-2 border-white border-opacity-50 text-white hover:bg-white hover:bg-opacity-10 hover:border-white transition-all duration-300 z-20 ${isLoaded ? 'animate-bounce' : ''}`}
        aria-label="Découvrir nos services de taxi à Verrières-le-Buisson"
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </Link>
    </section>
  );
}