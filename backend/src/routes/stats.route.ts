import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/stats/candidats-par-formation
router.get('/candidats-par-formation', async (req, res) => {
  try {
    // 1. Récupère toutes les formations avec leurs sessions et candidats
    const formations = await prisma.formation.findMany({
      include: {
        Sessions: {
          include: {
            inscriptions : {
              include :{
                candidat :true
              }

            }
          }
        }
      }
    });

    // 2. Calcule le nombre total de candidats par formation
    const stats = formations.map(f => ({
      titre: f.titre,
      totalCandidats: f.Sessions.reduce((sum, s) => sum + s.inscriptions.length, 0)
    })).filter(f => f.totalCandidats > 0); // Optionnel : exclure les 0

    res.json(stats);
  } catch (error) {
    console.error('Erreur stats candidats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});

// GET /api/stats/taux-remplissage
router.get('/taux-remplissage', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        formation: true,
        inscriptions :{
          include :{
            candidat: true
          }
        }
      }
    });

    const stats = sessions.map(s => ({
      session: ` Session #${s.id} - ${s.formation?.titre|| 'formation inconnue'}`,
      inscrits: s.inscriptions.length,
      taux: Math.round((s.inscriptions.length / 15) * 100)
    }));

    res.json(stats);
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;