import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
//import { Readable } from 'stream';


const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const formations = await prisma.formation.findMany();
    res.json(formations);
  } catch (error) {
    console.error('Erreur formations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});

// POST /api/formations → crée une nouvelle formation
router.post('/', async (req, res) => {
  const { titre, description, chargeHoraire, programmePdf, niveau, tags, categories } = req.body;

  if (!titre || !description || !chargeHoraire || !niveau) {
    return res.status(400).json({ error: 'Les champs obligatoires sont requis' });
  }

  try {
    const newFormation = await prisma.formation.create({
       data:{
        titre,
        description,
        chargeHoraire: Number(chargeHoraire),
        programmePdf: programmePdf || '',
        niveau:niveau||'débutant',
        tags,
        categories: categories|| '1'
      }
    });
    res.status(201).json(newFormation);
  } catch (error) {
    console.error('Erreur création formation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await prisma.$disconnect();
  }
});


// PUT /api/formations/:id → met à jour une formation
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { titre, description, chargeHoraire, programmePdf, niveau, tags, categories } = req.body;

  if (!titre || !description || !chargeHoraire || !niveau) {
    return res.status(400).json({ error: 'Les champs obligatoires sont requis' });
  }

  try {
  const updated = await prisma.formation.update({
      where: { id },
      data: {
        titre,
        description,
        chargeHoraire: Number(chargeHoraire),
        programmePdf: programmePdf || '',
        niveau,
        tags: tags || '',
        categories: categories || '1'
      }
    });
    res.json(updated);
  } catch (error) {
    console.error('Erreur mise à jour formation:', error);
    res.status(404).json({ error: 'Formation non trouvée' });
  } finally {
    await prisma.$disconnect();
  }
});
// DELETE /api/formations/:id → supprime une formation
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.formation.delete({
      where: { id }
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Erreur suppression formation:', error);
    res.status(404).json({ error: 'Formation non trouvée ou sessions associées existent' });
  } finally {
    await prisma.$disconnect();
  }
});

//******partie de l'impression du programme en pdf**********

// GET /api/formations/:id/pdf → génère un PDF
router.get('/:id/pdf', async (req, res) => {
  const id = Number(req.params.id);

  try {
    // Récupère la formation + sessions + formateurs
    const formation = await prisma.formation.findUnique({
      where: { id },
      include: {
        Sessions: {
          include: {
            formateurs: true,
            inscriptions :true,
          }
        }
      }
    });

    if (!formation) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }

    // Crée un document PDF
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Nom du fichier
    const filename = `fiche-formation-${formation.titre.replace(/\s+/g, '-').toLowerCase()}.pdf`;

    // En-tête HTTP pour afficher le PDF dans le navigateur
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // === Contenu du PDF ===

    // Logo / Titre
    doc.fontSize(22).fillColor('#0d6efd').text('ISET Rades', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).fillColor('#333').text('Fiche de Formation', { align: 'center' });
    doc.moveDown();

    // Titre de la formation
    doc.fontSize(16).fillColor('#000').text(formation.titre, { underline: true });
    doc.moveDown();

    // Informations clés
    doc.fontSize(12)
      .text(`• Niveau : ${formation.niveau}`)
      .text(`• Durée : ${formation.chargeHoraire} heures`)
      .text(`• Tags : ${formation.tags}`);

    doc.moveDown();
    doc.text('Description :', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(formation.description, { width: 400, align: 'justify' });

    doc.moveDown();
    doc.text('Sessions disponibles :', { underline: true });
    doc.moveDown(0.5);

    if (formation.Sessions.length === 0) {
      doc.text('Aucune session prévue actuellement.');
    } else {
      formation.Sessions.forEach(s => {
        const formateurs = s.formateurs.map(f => `${f.prenom} ${f.nom}`).join(', ');
        const nbCandidats = s.inscriptions.length;
        doc.text(`• Du ${s.dateDebut} au ${s.dateFin} (${nbCandidats}/15 inscrits)`, { indent: 10 });
        if (s.heureDebut) doc.text(`  Horaire : ${s.heureDebut} – ${s.heureFin}`, { indent: 20 });
        if (s.salle) doc.text(`  Salle : ${s.salle}`, { indent: 20 });
        doc.text(`  Formateurs : ${formateurs}`, { indent: 20 });
        doc.moveDown(0.3);
      });
    }

    doc.moveDown();
    doc.fontSize(10).fillColor('#666')
      .text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });

    // === Envoi du PDF ===

    // Convertit le PDF en stream et l'envoie
    const chunks: Buffer[] = [];
    doc.on('data', (chunk:Buffer) => chunks.push(chunk)); //collecte les parties du PDF
    doc.on('end', () => { //quand le PDF est terminé
      const pdfBuffer = Buffer.concat(chunks); //concat les parties du PDF
      res.send(pdfBuffer); //envoie le PDF au navigateur
    });

    doc.end();//lance la génération du PDF

  } catch (error) {
    console.error('Erreur génération PDF:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la génération du PDF' });
  } finally {
    await prisma.$disconnect();
  }
});












export default router;

