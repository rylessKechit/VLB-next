// src/app/flotte/layout.js
import { Metadata } from 'next';

export const metadata = {
  title: 'Notre Flotte de Taxis | Taxi VLB Verrières-le-Buisson',
  description: 'Découvrez notre flotte de véhicules premium : Tesla Model 3 électrique, Mercedes Classe E et Classe V. Service de taxi de qualité à Verrières-le-Buisson (91).',
  keywords: 'flotte taxi VLB, Tesla taxi, Mercedes taxi, véhicules premium Verrières-le-Buisson, taxi électrique Essonne',
  alternates: {
    canonical: 'https://www.taxi-verrieres-le-buisson.com/flotte',
  },
  openGraph: {
    title: 'Notre Flotte Premium | Taxi VLB',
    description: 'Découvrez nos véhicules d\'exception : Tesla Model 3, Mercedes Classe E et V pour vos déplacements à Verrières-le-Buisson.',
    url: 'https://www.taxi-verrieres-le-buisson.com/flotte',
    type: 'website',
  },
};

export default function FlotteLayout({ children }) {
  return children;
}