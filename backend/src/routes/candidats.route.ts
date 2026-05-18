import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const candidats = await prisma.candidat.findMany({
      include: {
        inscriptions: {
          include: {
            session :{
              include :{
                formation:true
              }

            }
          }
        }
      }
    });
    // Transformer pour garder une structure lisible (optionnel)
    const candidatsWithSessions = candidats.map(candidat => ({
      ...candidat,
      sessions: candidat.inscriptions.map(insc => ({
        id: insc.session.id,
        dateDebut: insc.session.dateDebut,
        dateFin: insc.session.dateFin,
        description: insc.session.description,
        formation: insc.session.formation
      }))
    }));

    res.json(candidats);
  } catch (error) {
    console.error('Erreur chargement candidats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});

router.post('/', async (req, res) => {
  const { nom, prenom, email } = req.body;

  if (!nom || !prenom || !email) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const candidat = await prisma.candidat.create({ data: { nom, prenom, email } });
    res.status(201).json(candidat);
  } catch (error) {
    console.error('Erreur création candidat:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { nom, prenom, email } = req.body;

  if (!nom || !prenom || !email) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const updated = await prisma.candidat.update({
      where: { id },
      data: { nom, prenom, email }
    });
    res.json(updated);
  } catch (error) {
    console.error('Erreur mise à jour candidat:', error);
    res.status(404).json({ error: 'Candidat non trouvé' });
  } finally {
    await prisma.$disconnect();
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.inscription.deleteMany({ where: { candidatId: id } });
    await prisma.candidat.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erreur suppression candidat:', error);
    res.status(404).json({ error: 'Candidat non trouvé' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;