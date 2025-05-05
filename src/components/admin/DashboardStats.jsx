import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Composant de statistiques pour le tableau de bord admin
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
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white mr-3`}>
          <FontAwesomeIcon icon={icon} className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
  
  // Si un lien est fourni, envelopper le contenu dans un composant Link
  if (link) {
    return (
      <Link href={link} className="block">
        {content}
      </Link>
    );
  }
  
  // Sinon, renvoyer simplement le contenu
  return content;
};

export default DashboardStats;