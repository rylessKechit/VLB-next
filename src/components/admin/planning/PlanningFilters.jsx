// src/components/admin/planning/PlanningFilters.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const PlanningFilters = ({ showFilters, setShowFilters, statusFilter, setStatusFilter }) => {
  return (
    <div>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center">
          <FontAwesomeIcon icon={faFilter} className="text-gray-500 mr-2" />
          <span className="font-medium text-gray-700">Filtres</span>
          {statusFilter && (
            <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              {statusFilter}
            </span>
          )}
        </div>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {showFilters && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-base"
            >
              <option value="">Tous les statuts</option>
              <option value="confirmed">Confirmé</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningFilters;