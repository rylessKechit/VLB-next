"use client";

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    // Fonction pour optimiser le chargement des polices
    const optimizeFontLoading = () => {
      // Vérifier si la police a déjà été chargée
      if (document.fonts && document.fonts.check('1em Poppins')) {
        document.documentElement.classList.add('fonts-loaded');
        return;
      }

      // Ajouter un écouteur pour savoir quand les polices sont chargées
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    };

    optimizeFontLoading();
  }, []);

  // Ce composant ne rend rien
  return null;
}