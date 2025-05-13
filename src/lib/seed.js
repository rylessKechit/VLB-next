// src/lib/seed.js
// Ce script initialise la base de données avec un utilisateur admin si aucun n'existe

import dbConnect from './mongodb';
import User from '@/models/User';

export async function seedDatabase() {
  try {
    await dbConnect();
    
    // Vérifier s'il existe déjà un administrateur
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      console.log('Aucun administrateur trouvé, création d\'un compte par défaut...');
      
      // Créer un administrateur par défaut
      const defaultAdmin = new User({
        name: 'Administrateur',
        email: 'admin@taxivlb.com',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'motdepasse123',
        role: 'admin',
        phone: '+33600000000',
        status: 'active'
      });
      
      await defaultAdmin.save();
      console.log('Compte administrateur créé avec succès!');
      console.log(`Email: ${defaultAdmin.email}`);
      console.log(`Mot de passe: ${process.env.DEFAULT_ADMIN_PASSWORD || 'motdepasse123'}`);
      console.log('IMPORTANT: Veuillez modifier ce mot de passe après votre première connexion!');
    }
    
    // Vérifier s'il existe déjà un chauffeur
    const driverExists = await User.findOne({ role: 'driver' });
    
    if (!driverExists) {
      console.log('Aucun chauffeur trouvé, création d\'un compte de démonstration...');
      
      // Créer un chauffeur de démonstration
      const demoDriver = new User({
        name: 'Pierre G.',
        email: 'chauffeur@taxivlb.com',
        password: process.env.DEFAULT_DRIVER_PASSWORD || 'motdepasse123!',
        role: 'driver',
        phone: '+33611111111',
        status: 'active',
        driverInfo: {
          licenseNumber: 'DEMO12345',
          vehicleInfo: {
            make: 'Mercedes',
            model: 'Classe V',
            year: 2023,
            licensePlate: 'AB-123-CD',
            color: 'Noir'
          }
        }
      });
      
      await demoDriver.save();
      console.log('Compte chauffeur de démonstration créé avec succès!');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    return { success: false, error };
  }
}