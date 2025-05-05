// src/lib/mongodb-client.js
// Ce fichier est nécessaire pour l'adaptateur MongoDB de NextAuth.js

import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Veuillez définir la variable d\'environnement MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // En développement, utiliser une variable globale pour que la connexion
  // Hot-reloading ne crée pas de nouvelles connexions à chaque fois
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // En production, il est préférable d'utiliser une nouvelle instance de MongoClient
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;