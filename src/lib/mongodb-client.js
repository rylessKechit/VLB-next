import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

// En mode développement, utilisez une variable globale pour éviter les reconnexions
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // En production, créez une nouvelle instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;