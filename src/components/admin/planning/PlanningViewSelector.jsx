// src/components/admin/planning/PlanningViewSelector.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarDay, 
  faCalendarWeek, 
  faCalendar, 
  faList 
} from '@fortawesome/free-solid-svg-icons';

const PlanningViewSelector = ({ view, setView }) => {
  const viewOptions = [
    { key: 'day', icon: faCalendarDay, label: 'Jour' },
    { key: 'week', icon: faCalendarWeek, label: 'Semaine' },
    { key: 'month', icon: faCalendar, label: 'Mois' },
    { key: 'list', icon: faList, label: 'Liste' }
  ];

  return (
    <div className="grid grid-cols-4 gap-1 bg-gray-100 rounded-lg p-1">
      {viewOptions.map((viewOption) => (
        <button
          key={viewOption.key}
          onClick={() => setView(viewOption.key)}
          className={`flex flex-col items-center py-2 px-1 rounded-md text-xs font-medium transition-colors ${
            view === viewOption.key
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <FontAwesomeIcon icon={viewOption.icon} className="h-4 w-4 mb-1" />
          {viewOption.label}
        </button>
      ))}
    </div>
  );
};

export default PlanningViewSelector;