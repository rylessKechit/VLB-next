import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Composant de statistiques responsive pour le tableau de bord admin
 * Optimisé pour mobile et desktop
 * 
 * @param {Object} props
 * @param {string} props.title - Titre de la statistique
 * @param {number} props.value - Valeur à afficher
 * @param {Object} props.icon - Icône FontAwesome à afficher
 * @param {string} props.color - Classe Tailwind pour la couleur de fond (ex: bg-blue-500)
 * @param {string} props.link - Lien vers la page détaillée (optionnel)
 */
const DashboardStats = ({ title, value, icon, color, link }) => {
  const content = (
    <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full ${color} flex items-center justify-center text-white mr-3 flex-shrink-0`}>
          <FontAwesomeIcon icon={icon} className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
  
  // Si un lien est fourni, envelopper le contenu dans un composant Link
  if (link) {
    return (
      <Link href={link} className="block group">
        {content}
      </Link>
    );
  }
  
  // Sinon, renvoyer simplement le contenu
  return content;
};

export default DashboardStats;