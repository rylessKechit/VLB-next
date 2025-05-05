// src/app/api/seed/route.js
import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

// Cette API ne doit être accessible qu'en mode développement ou via une clé secrète en production
export async function GET(request) {
  try {
    // En production, vérifier la clé secrète
    if (process.env.NODE_ENV === 'production') {
      const { searchParams } = new URL(request.url);
      const apiKey = searchParams.get('apiKey');
      
      if (apiKey !== process.env.SEED_API_KEY) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }
    }
    
    // Initialiser la base de données
    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Base de données initialisée avec succès'
      });
    } else {
      return NextResponse.json(
        { error: 'Erreur lors de l\'initialisation de la base de données' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'initialisation de la base de données.' },
      { status: 500 }
    );
  }
}