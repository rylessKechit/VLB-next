// src/lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import dbConnect from "./mongodb";
import User from "@/models/User";
import clientPromise from "./mongodb-client"; // Nous allons créer ce fichier

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        // Trouver l'utilisateur par email
        const user = await User.findOne({ email: credentials.email });
        
        // Vérifier si l'utilisateur existe et le mot de passe est correct
        if (user && await user.comparePassword(credentials.password)) {
          // Mise à jour de la dernière connexion
          user.lastLogin = new Date();
          await user.save();
          
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: null,
          };
        }
        
        // Authentification échouée
        return null;
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      // Ajouter des attributs personnalisés au token JWT
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Transmettre les attributs personnalisés à la session
      if (token) {
        session.user.id = token.userId;
        session.user.role = token.role;
      }
      return session;
    }
  },
  
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 heures
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === "development",
};