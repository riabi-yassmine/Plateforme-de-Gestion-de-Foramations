import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.post('/:id/inscription', async (req, res) => {
  const sessionId = Number(req.params.id);
  const { nom, prenom, email } = req.body;

  if (Number.isNaN(sessionId)) {
    return res.status(400).json({ error: 'ID session invalide' });
  }

  if (!nom || !prenom || !email) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        inscriptions: {
          include: {
            candidat: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session non trouvee' });
    }

    const candidats = session.inscriptions.map(insc => insc.candidat);

    if (candidats.length >= 15) {
      return res.status(400).json({ error: 'Session complete (max 15 candidats)' });
    }

    const emailNormalise = String(email).trim().toLowerCase();
    const dejaInscrit = candidats.some(c => c.email.trim().toLowerCase() === emailNormalise);
    if (dejaInscrit) {
      return res.status(400).json({ error: 'Vous etes deja inscrit a cette session' });
    }

    let candidat = await prisma.candidat.findFirst({
      where: { email: emailNormalise },
    });

    if (!candidat) {
      candidat = await prisma.candidat.create({
        data: {
          nom: String(nom).trim(),
          prenom: String(prenom).trim(),
          email: emailNormalise,
        },
      });
    } else {
      candidat = await prisma.candidat.update({
        where: { id: candidat.id },
        data: {
          nom: String(nom).trim(),
          prenom: String(prenom).trim(),
        },
      });
    }

    await prisma.inscription.create({
      data: {
        candidatId: candidat.id,
        sessionId: session.id,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Inscription reussie',
      total: candidats.length + 1,
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/', async (req, res) => {
  try {
    const inscriptions = await prisma.inscription.findMany({
      include: {
        candidat: true,
        session: {
          include: {
            formation: true,
          },
        },
      },
      orderBy: {
        sessionId: 'desc',
      },
    });

    const data = inscriptions.map(insc => ({
      id: `${insc.candidatId}-${insc.sessionId}`,
      candidat: `${insc.candidat.prenom} ${insc.candidat.nom}`,
      email: insc.candidat.email,
      session: `Session #${insc.session.id}`,
      formation: insc.session.formation.titre,
      dateDebut: insc.session.dateDebut,
      dateFin: insc.session.dateFin,
    }));

    res.json(data);
  } catch (error) {
    console.error('Erreur chargement inscriptions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

//route pour inscription candidat partie publique
// POST /api/inscriptions/mes-inscriptions
router.post('/mes-inscriptions', async (req, res) => {
  const { nom, prenom, email } = req.body;

  if (!nom || !prenom || !email) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    // Étape 1 : Chercher par email (indexé, rapide)
    const candidats = await prisma.candidat.findMany({
      where: {
        email: { equals: email.trim() }
      },
      include: {
        inscriptions: {
          include: {
            session: {
              include: {
                formation: true
              }
            }
          }
        }
      }
    });

    // Étape 2 : Filtrer en mémoire (insensible à la casse)
    const candidatMatch = candidats.find(c =>
      c.nom.toLowerCase() === nom.trim().toLowerCase() &&
      c.prenom.toLowerCase() === prenom.trim().toLowerCase()
    );

    if (!candidatMatch) {
      return res.json([]); // Aucun candidat trouvé
    }

    // Retourner ses inscriptions
    res.json(candidatMatch.inscriptions);

  } catch (error) {
    console.error('Erreur recherche inscriptions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});

// DELETE /api/inscriptions/:candidatId/:sessionId
router.delete('/:candidatId/:sessionId', async (req, res) => {
  const candidatId = Number(req.params.candidatId);
  const sessionId = Number(req.params.sessionId);

  if (Number.isNaN(candidatId) || Number.isNaN(sessionId)) {
    return res.status(400).json({ error: 'Parametres invalides' });
  }

  try {
    await prisma.inscription.delete({
      where: {
        candidatId_sessionId: {
          candidatId,
          sessionId,
        },
      },
    });

    return res.json({ success: true, message: 'Inscription annulee' });
  } catch (error) {
    console.error('Erreur annulation inscription:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
