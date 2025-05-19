// components/admin/RevenueTimeFilter.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarDay, 
  faCalendarWeek, 
  faCalendarAlt,
  faHistory
} from '@fortawesome/free-solid-svg-icons';

/**
 * Composant pour filtrer les revenus par période
 */
const RevenueTimeFilter = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'today', label: "Aujourd'hui", icon: faCalendarDay },
    { id: 'week', label: 'Cette semaine', icon: faCalendarWeek },
    { id: 'month', label: 'Ce mois-ci', icon: faCalendarAlt },
    { id: 'last_month', label: 'Mois précédent', icon: faHistory },
    { id: 'all', label: 'Toutes périodes', icon: faCalendarAlt }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 mb-4">
      <div className="flex flex-wrap gap-1">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FontAwesomeIcon icon={filter.icon} className="mr-1.5 h-3 w-3" />
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RevenueTimeFilter;