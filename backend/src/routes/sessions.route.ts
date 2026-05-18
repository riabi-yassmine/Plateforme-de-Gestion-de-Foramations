/* import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        formateurs: true,
       // candidats: true,
        formation:true
        
      }
    });
 //ajoute formateursIDs pour le frontend
    const sessionsWithIds = sessions.map(s => ({
      ...s,
      formateursIds: s.formateurs.map(f => f.id)
    }));

    res.json(sessionsWithIds);
  } catch (error) {
    console.error
    ('Erreur sessions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});

// POST /api/sessions → crée une nouvelle session+ relier les formateurs
router.post('/', async (req, res) => {
  const { formationId, dateDebut, dateFin, description, formateursIds } = req.body;
  //validation des dates
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
    return res.status(400).json({ error: 'Dates invalides' });
  }
  if (fin < debut) {
    return res.status(400).json({ error: 'La date de fin doit être supérieure ou égale à la date de début.' });
  }
  //

  if (!formationId || !dateDebut || !dateFin || !formateursIds || formateursIds.length === 0) {
    return res.status(400).json({ error: 'Tous les champs obligatoires sont requis' });
  }

  try {
    const newSession = await prisma.session.create({
       data: {
        dateDebut,
        dateFin,
        description: description || '',
        formationId: Number(formationId),
        formateurs: {
          connect: formateursIds.map((id: any) => ({ id: Number(id) }))
        }
      }
    });
    const sessionWithIds = {
      ...newSession,
      formateursIds: formateursIds.map((id: any) => Number(id))
    };

    res.status(201).json(sessionWithIds);
  } catch (error) {
    console.error('Erreur création session:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});

// PUT /api/sessions/:id → met à jour une session
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { formationId, dateDebut, dateFin, description, formateursIds } = req.body;
  //validation des dates
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
    return res.status(400).json({ error: 'Dates invalides' });
  }
  if (fin < debut) {
    return res.status(400).json({ error: 'La date de fin doit être supérieure ou égale à la date de début.' });
  }
  //

  if (!formationId || !dateDebut || !dateFin || !formateursIds || formateursIds.length === 0) {
    return res.status(400).json({ error: 'Tous les champs obligatoires sont requis' });
  }
  try {
    // ⚠️ Prisma ne supporte pas la mise à jour directe des relations many-to-many
    // → On supprime puis recrée les liens

    // 1. Supprime les anciens liens
    await prisma.session.update({
      where: { id },
       data:{
        formateurs: {
          set: [] // déconnecte tous les formateurs(supprime les anciens liens)
        }
      }
    });

    // 2. Met à jour les données + reconnecte les formateurs
    const updated = await prisma.session.update({
      where: { id },
       data:{
        dateDebut,
        dateFin,
        description: description || '',
        formationId: Number(formationId),
        formateurs: {
          connect: formateursIds.map((id: any) => ({ id: Number(id) })) //reconnexion
        }
      }
    });

    const sessionWithIds = {
      ...updated,
      formateursIds: formateursIds.map((id: any) => Number(id))
    };

    res.json(sessionWithIds);
  } catch (error) {
    console.error('Erreur mise à jour session:', error);
    res.status(404).json({ error: 'Session non trouvée' });
  } finally {
    await prisma.$disconnect();
  }
});

// DELETE /api/sessions/:id → supprime une session par ID
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.session.delete({
      where: { id }
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Erreur suppression session:', error);
    res.status(404).json({ error: 'Session non trouvée ou candidats inscrits' });
  } finally {
    await prisma.$disconnect();
  }
});


export default router;
 */
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        formateurs: true,
        formation: true,
        // Chargement des inscriptions pour compter les candidats (optionnel)
        inscriptions: {
          include: {
            candidat: true
          }
        }
      }
    });

    // Ajoute formateursIds pour le frontend
    const sessionsWithIds = sessions.map(s => ({
      ...s,
      formateursIds: s.formateurs.map(f => f.id),
      // Optionnel : nombre de candidats
      nbCandidats: s.inscriptions.length
    }));

    res.json(sessionsWithIds);
  } catch (error) {
    console.error('Erreur sessions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});

// POST /api/sessions
router.post('/', async (req, res) => {
  const { formationId, dateDebut, dateFin, description, formateursIds, heureDebut, heureFin, salle } = req.body;

  // Validation des dates
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
    return res.status(400).json({ error: 'Dates invalides' });
  }
  if (fin < debut) {
    return res.status(400).json({ error: 'La date de fin doit être supérieure ou égale à la date de début.' });
  }

  if (!formationId || !dateDebut || !dateFin || !formateursIds || formateursIds.length === 0) {
    return res.status(400).json({ error: 'Tous les champs obligatoires sont requis' });
  }

  try {
    const newSession = await prisma.session.create({
      data: {
        dateDebut,
        dateFin,
        heureDebut: heureDebut || '',
        heureFin: heureFin || '',
        salle: salle || '',
        description: description || '',
        formationId: Number(formationId),
        formateurs: {
          connect: formateursIds.map((id: any) => ({ id: Number(id) }))
        }
      }
    });

    const sessionWithIds = {
      ...newSession,
      formateursIds: formateursIds.map((id: any) => Number(id))
    };

    res.status(201).json(sessionWithIds);
  } catch (error) {
    console.error('Erreur création session:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});

// PUT /api/sessions/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { formationId, dateDebut, dateFin, description, formateursIds, heureDebut, heureFin, salle } = req.body;

  // Validation des dates
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
    return res.status(400).json({ error: 'Dates invalides' });
  }
  if (fin < debut) {
    return res.status(400).json({ error: 'La date de fin doit être supérieure ou égale à la date de début.' });
  }

  if (!formationId || !dateDebut || !dateFin || !formateursIds || formateursIds.length === 0) {
    return res.status(400).json({ error: 'Tous les champs obligatoires sont requis' });
  }

  try {
    // Déconnecte tous les formateurs
    await prisma.session.update({
      where: { id },
      data: {
        formateurs: { set: [] }
      }
    });

    // Met à jour + reconnecte
    const updated = await prisma.session.update({
      where: { id },
      data: {
        dateDebut,
        dateFin,
        heureDebut: heureDebut || '',
        heureFin: heureFin || '',
        salle: salle || '',
        description: description || '',
        formationId: Number(formationId),
        formateurs: {
          connect: formateursIds.map((id: any) => ({ id: Number(id) }))
        }
      }
    });

    const sessionWithIds = {
      ...updated,
      formateursIds: formateursIds.map((id: any) => Number(id))
    };

    res.json(sessionWithIds);
  } catch (error) {
    console.error('Erreur mise à jour session:', error);
    res.status(404).json({ error: 'Session non trouvée' });
  } finally {
    await prisma.$disconnect();
  }
});

// DELETE /api/sessions/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    // Optionnel : vérifier qu’aucun candidat n’est inscrit
    const session = await prisma.session.findUnique({
      where: { id },
      include: { inscriptions: true }
    });

    if (session && session.inscriptions.length > 0) {
      return res.status(400).json({ error: 'Impossible de supprimer une session avec des inscriptions' });
    }

    await prisma.session.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erreur suppression session:', error);
    res.status(404).json({ error: 'Session non trouvée' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
