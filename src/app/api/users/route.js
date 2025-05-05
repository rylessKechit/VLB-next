// src/app/api/users/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Récupérer tous les utilisateurs (admin uniquement)
export async function GET(request) {
  try {
    await dbConnect();
    
    // Vérifier si l'utilisateur est authentifié et est admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Construire le filtre
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    
    // Récupérer les utilisateurs
    const users = await User.find(query)
      .select('-password') // Exclure le mot de passe
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Compter le nombre total d'utilisateurs
    const total = await User.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        total,
        limit,
        skip
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des utilisateurs.' },
      { status: 500 }
    );
  }
}

// Créer un nouvel utilisateur (admin uniquement)
export async function POST(request) {
  try {
    await dbConnect();
    
    // Vérifier si l'utilisateur est authentifié et est admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà.' },
        { status: 400 }
      );
    }
    
    // Créer le nouvel utilisateur
    const newUser = new User(data);
    await newUser.save();
    
    // Retourner l'utilisateur créé sans le mot de passe
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;
    
    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'Utilisateur créé avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de l\'utilisateur.' },
      { status: 500 }
    );
  }
}