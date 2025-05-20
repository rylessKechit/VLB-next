// src/lib/seed.js
// Ce script initialise la base de données avec un utilisateur admin si aucun n'existe

import dbConnect from './mongodb';
import User from '@/models/User';

export async function seedDatabase() {
  try {
    await dbConnect();
    
    console.log('Aucun administrateur trouvé, création d\'un compte par défaut...');
      
      // Créer un administrateur par défaut
      const defaultAdmin = new User({
        name: 'Administrateur',
        email: 'admin@vlb.com',
        password: 'VlbAdmin123!',
        role: 'admin',
        phone: '+33665113928',
        status: 'active'
      });
      
      await defaultAdmin.save();
      console.log('Compte administrateur créé avec succès!');
      console.log(`Email: ${defaultAdmin.email}`);
      console.log(`Mot de passe: ${process.env.DEFAULT_ADMIN_PASSWORD || 'motdepasse123'}`);
      console.log('IMPORTANT: Veuillez modifier ce mot de passe après votre première connexion!');
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    return { success: false, error };
  }
}