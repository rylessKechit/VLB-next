import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./mongodb";
import User from "@/models/User";

export const authOptions = {
  // Retiré: adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        try {
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
            };
          }
          
          // Authentification échouée
          return null;
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
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
    maxAge: 24 * 60 * 60,
  },
  
  secret: process.env.NEXTAUTH_SECRET || "un-secret-temporaire",
  
  debug: true,
};