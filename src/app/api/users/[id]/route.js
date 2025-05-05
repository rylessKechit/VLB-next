// src/app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Récupérer un utilisateur spécifique
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Vérifier si l'utilisateur est authentifié
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    // Seul un admin peut voir n'importe quel utilisateur
    // Un utilisateur normal peut uniquement voir son propre profil
    if (session.user.role !== 'admin' && session.user.id !== id) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }
    
    // Récupérer l'utilisateur
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: user
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération de l\'utilisateur.' },
      { status: 500 }
    );
  }
}

// Mettre à jour un utilisateur
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const data = await request.json();
    
    // Vérifier si l'utilisateur est authentifié
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    // Seul un admin peut modifier n'importe quel utilisateur
    // Un utilisateur normal peut uniquement modifier son propre profil
    if (session.user.role !== 'admin' && session.user.id !== id) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }
    
    // Récupérer l'utilisateur
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    
    // Empêcher un utilisateur non-admin de modifier son propre rôle
    if (session.user.role !== 'admin' && data.role && data.role !== user.role) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à modifier votre rôle' },
        { status: 403 }
      );
    }
    
    // Mettre à jour les champs
    Object.keys(data).forEach(key => {
      // Ne pas modifier l'email et l'id
      if (key !== '_id' && key !== 'email') {
        // Traitement spécial pour le mot de passe (le pré-hook dans le modèle va le hacher)
        if (key === 'password' && data[key]) {
          user[key] = data[key];
        } 
        // Autres champs
        else if (key !== 'password') {
          user[key] = data[key];
        }
      }
    });
    
    // Sauvegarder les modifications
    await user.save();
    
    // Retourner l'utilisateur mis à jour sans le mot de passe
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'Utilisateur mis à jour avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.' },
      { status: 500 }
    );
  }
}

// Supprimer un utilisateur (admin uniquement)
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Vérifier si l'utilisateur est authentifié et est admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    // Récupérer l'utilisateur
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    
    // Empêcher la suppression du dernier admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Impossible de supprimer le dernier administrateur' },
          { status: 400 }
        );
      }
    }
    
    // Supprimer l'utilisateur
    await User.deleteOne({ _id: id });
    
    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression de l\'utilisateur.' },
      { status: 500 }
    );
  }
}