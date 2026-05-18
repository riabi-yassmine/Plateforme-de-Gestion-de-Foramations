import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const router = Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success:false,
      error: 'Email et mot de passe requis' 
    });
  }

  try {
    // 1. Cherche l'admin
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({
        success:false,
         error: 'Identifiants invalides' 
        });
    }

    // 2. Vérifie le mot de passe
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({
        success:false,
         error: 'Identifiants invalides' 
        });
    }
   
console.log('Email reçu:', email);
console.log('Mot de passe en base:', admin.password);
console.log('Comparaison:', await bcrypt.compare(password, admin.password));
    // 3.  Succès → renvoie un token (ou juste un succès )
    res.json({
       success: true,
        message: 'Connexion réussie' 
      });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ 
      success:false,
      error: 'Erreur serveur'
     });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;