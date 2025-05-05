"use client";

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

/**
 * Composant graphique pour afficher l'évolution des réservations
 * 
 * @param {Object} props
 * @param {Array} props.data - Données pour le graphique
 * @param {string} props.type - Type de graphique (default: 'daily')
 */
const BookingChart = ({ data = [], type = 'daily' }) => {
  // Si aucune donnée n'est fournie, utiliser des données de démonstration
  if (!data || data.length === 0) {
    // Générer des données de démonstration
    data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const formattedDate = date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit'
      });
      
      // Valeurs aléatoires pour la démonstration
      data.push({
        date: formattedDate,
        confirmées: Math.floor(Math.random() * 8) + 1,
        enAttente: Math.floor(Math.random() * 5),
        annulées: Math.floor(Math.random() * 3)
      });
    }
  }
  
  // Configuration du graphique
  const chartConfig = {
    daily: {
      xAxisDataKey: 'date',
      lines: [
        { dataKey: 'confirmées', stroke: '#10B981', activeDot: { r: 8 } },
        { dataKey: 'enAttente', stroke: '#F59E0B', activeDot: { r: 8 } },
        { dataKey: 'annulées', stroke: '#EF4444', activeDot: { r: 8 } }
      ]
    },
    monthly: {
      xAxisDataKey: 'month',
      lines: [
        { dataKey: 'confirmées', stroke: '#10B981', activeDot: { r: 8 } },
        { dataKey: 'enAttente', stroke: '#F59E0B', activeDot: { r: 8 } },
        { dataKey: 'annulées', stroke: '#EF4444', activeDot: { r: 8 } }
      ]
    }
  };
  
  const config = chartConfig[type] || chartConfig.daily;
  
  // Personnalisation du tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.stroke }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={config.xAxisDataKey} 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          allowDecimals={false}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {config.lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            activeDot={line.activeDot}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BookingChart;