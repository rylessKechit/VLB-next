import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white pt-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between pb-10 border-b border-gray-700 border-opacity-30">
          <div className="w-full md:w-auto mb-8 md:mb-0">
            <Link href="/" className="block mb-6">
              <Image 
                src="/images/logo.webp" 
                alt="Taxi VLB Logo" 
                width={150} 
                height={60} 
                loading="eager"
                quality={80}
                className="h-auto w-auto"
                sizes="(max-width: 768px) 150px, 150px"
                priority={true}
              />
            </Link>
            <p className="max-w-md text-gray-300">
              Service de taxi de qualité à Verrières-le-Buisson. 
              Disponible 24h/24 et 7j/7 pour tous vos déplacements.
            </p>
          </div>
          
          <div className="flex flex-wrap md:gap-12">
            <div className="w-1/2 sm:w-auto mb-6">
              <h4 className="text-lg font-semibold mb-4 text-primary">Nos services</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/services/aeroport-gare" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Transfert aéroport
                  </Link>
                </li>
                <li>
                  <Link href="/services/aeroport-gare" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Transport gare
                  </Link>
                </li>
                <li>
                  <Link href="/services/longue-distance" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Longue distance
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="w-1/2 sm:w-auto mb-6">
              <h4 className="text-lg font-semibold mb-4 text-primary">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="https://maps.app.goo.gl/xyz" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <span>Verrières-le-Buisson</span>
                  </Link>
                </li>
                <li>
                  <Link href="tel:+33665113928" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <span>+33 6 65 11 39 28</span>
                  </Link>
                </li>
                <li>
                  <Link href="mailto:contact@taxivlb.com" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <span>contact@taxivlb.com</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <div>
            &copy; {currentYear} Taxi VLB. Tous droits réservés.
          </div>
        </div>
      </div>
      
      {/* Gradient line at the bottom */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:300%_100%] animate-gradient"></div>
    </footer>
  );
};

export default Footer;