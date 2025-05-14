import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Veuillez définir la variable d\'environnement MONGODB_URI dans .env.local');
}

// Variable globale pour maintenir la connexion
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('🔄 Utilisation de la connexion existante');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log('🔄 Tentative de connexion à MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connecté avec succès");
        return mongoose;
      })
      .catch(err => {
        console.error("❌ Erreur de connexion MongoDB:", err);
        cached.promise = null; // Reset promise si échec
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("❌ Échec de connexion à MongoDB:", error);
    cached.promise = null; // Reset promise si échec
    throw error;
  }
}

export default dbConnect;