
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { error } from 'node:console';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const formateurs = await prisma.formateur.findMany();
    res.json(formateurs);
  } catch (error) {
    console.error('Erreur formateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});

//POST /api/formateurs → crée un nouveau formateur
router.post('/', async (req, res) => {
  const { nom, prenom, email,telephone, cin, specialites, cv, photo } = req.body;

  if (!nom || !prenom ||!email|| !telephone || !cin || !specialites) {
    return res.status(400).json({ error: 'Tous les champs obligatoires sont requis' });
  }
  try {
    const newFormateur = await prisma.formateur.create({
   data:{
        nom,
        prenom,
        email,
        telephone,
        cin,
        photo: photo || '',
        cv: cv || '',
        specialites, 
       
   }
    });
    res.status(201).json(newFormateur);
  } catch (error) {
    console.error('Erreur création formateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});


// PUT /api/formateurs/:id → met à jour un formateur
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { nom, prenom, telephone, cin, specialites, cv, photo } = req.body;

  if (!nom || !prenom || !telephone || !cin || !specialites) {
    return res.status(400).json({ error: 'Tous les champs obligatoires sont requis' });
  }

  try {
    const updated = await prisma.formateur.update({
      where: { id },
      data: { nom, prenom, telephone, cin, specialites, cv, photo }
    });
    res.json(updated);
  } catch (error) {
    console.error('Erreur mise à jour formateur:', error);
    res.status(404).json({ error: 'Formateur non trouvé' });
  } finally {
    await prisma.$disconnect();
  }
});
// DELETE /api/formateurs/:id → supprime un formateur
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.formateur.delete({
      where: { id }
    });
    res.status(204).send(); 
  } catch (error) {
    console.error('Erreur suppression formateur:', error);
    res.status(404).json({ error: 'Formateur non trouvé' });
  } finally {
    await prisma.$disconnect();
  }
});


export default router;
