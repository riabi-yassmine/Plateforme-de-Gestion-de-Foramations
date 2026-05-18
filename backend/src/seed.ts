import { PrismaClient } from '@prisma/client';
import { create } from 'node:domain';
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'] // Optionnel
});

async function main() {
  console.log('🌱 Démarrage du seed...');
  await prisma.inscription.deleteMany();
  await prisma.candidat.deleteMany();
  await prisma.session.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.formateur.deleteMany();
  //await prisma.admin.deleteMany();
  console.log('✅ Base nettoyée. Création des données...');
  // Formations
  const angular = await prisma.formation.create({
    data: {
      titre: 'Angular avancé pou les prochains développeurs',
      description: 'Formation accélérée sur Angular, alliant théorie et pratique : de la structure modulaire aux bonnes pratiques de développement, pour produire des applications robustes et maintenables.',
      chargeHoraire: 40,
      programmePdf: 'assets/programmes/angular.pdf',
      niveau: 'avancé',
      tags: 'Angular,TypeScript',
      categories: "1"
    }
  });

  const java = await prisma.formation.create({
    data: {
      titre: 'Java pour la POO',
      description: 'Apprenez les concepts avancés de java pour devenez opérationnel en Java et POO : modélisation, encapsulation, polymorphisme et tests unitaires — à travers des exercices progressifs et un mini-projet final.',
      chargeHoraire: 35,
      programmePdf: 'assets/programmes/java.pdf',
      niveau: 'intermédiaire',
      tags: 'Java,POO',
      categories: "2"
    }

  });
  const python = await prisma.formation.create({
    data: {
      titre: 'python dans le mode POO',
      description: 'Apprenez les concepts fondamentaux de python et découvrez le en mode POO ! Une initiation progressive pour débutants et intermédiaires : de la syntaxe de base à la modélisation objet, avec des exemples concrets et un mini-projet ludique',
      chargeHoraire: 35,
      programmePdf: 'assets/programmes/python.pdf',
      niveau: 'débutant',
      tags: 'python,POO',
      categories: "2"
    }
  });
  const dataScience = await prisma.formation.create({
    data: {
      titre: 'Formation Data Science pour les débutants',
      description: 'Apprenez les concepts fondamentaux de data science dans une Une formation 100% débutante pour découvrir ce métier passionnant, apprendre à parler le langage des données et réaliser vos premières analyses. Aucun prérequis en programmation nécessaire',
      chargeHoraire: 35,
      programmePdf: 'assets/programmes/python.pdf',
      niveau: 'débutant',
      tags: 'data science,information',
      categories: "3"
    }
  });

  const springBoot = await prisma.formation.create({
    data: {
      titre: 'Spring Boot & API REST',
      description: 'Construisez des APIs RESTful robustes avec Spring Boot. Au programme : architecture MVC, injection de dépendances, JPA/Hibernate, sécurité avec Spring Security et déploiement avec Docker.',
      chargeHoraire: 45,
      programmePdf: 'assets/programmes/spring.pdf',
      niveau: 'avancé',
      tags: 'Spring Boot,Java,REST API',
      categories: "1"
    }
  });

  const reactJs = await prisma.formation.create({
    data: {
      titre: 'React.js — du zéro au professionnel',
      description: 'Maîtrisez React.js en partant de zéro : composants, hooks, gestion d\'état avec Redux, routing avec React Router et consommation d\'APIs REST. Projets pratiques inclus.',
      chargeHoraire: 40,
      programmePdf: 'assets/programmes/react.pdf',
      niveau: 'intermédiaire',
      tags: 'React,JavaScript,Frontend',
      categories: "1"
    }
  });

  const cSharp = await prisma.formation.create({
    data: {
      titre: 'C# et .NET — Programmation orientée objet',
      description: 'Découvrez C# et l\'écosystème .NET : syntaxe, POO, LINQ, Entity Framework et développement d\'applications desktop avec WinForms. Une formation complète pour les futurs développeurs .NET.',
      chargeHoraire: 38,
      programmePdf: 'assets/programmes/csharp.pdf',
      niveau: 'débutant',
      tags: 'C#,.NET,POO',
      categories: "2"
    }
  });

  const machineLearning = await prisma.formation.create({
    data: {
      titre: 'Machine Learning avec Python',
      description: 'Plongez dans le machine learning avec scikit-learn, pandas et matplotlib. Classification, régression, clustering et évaluation de modèles. Un projet fil rouge sur des données réelles.',
      chargeHoraire: 50,
      programmePdf: 'assets/programmes/ml.pdf',
      niveau: 'avancé',
      tags: 'Machine Learning,Python,IA',
      categories: "3"
    }
  });

  const sqlDb = await prisma.formation.create({
    data: {
      titre: 'Bases de données SQL — MySQL & PostgreSQL',
      description: 'Maîtrisez la conception et l\'interrogation de bases de données relationnelles. Modélisation UML, SQL avancé, procédures stockées, indexation et optimisation des requêtes.',
      chargeHoraire: 30,
      programmePdf: 'assets/programmes/sql.pdf',
      niveau: 'intermédiaire',
      tags: 'SQL,MySQL,PostgreSQL',
      categories: "3"
    }
  });

  // Formateurs
  const jamil = await prisma.formateur.create({
    data: { nom: 'Jomaa', prenom: 'Jamil', email: "jamiljom3@gmail.com", telephone: "22785665", cin: "12345678", photo: 'assets/photos/jamil.jpg', cv: 'assets/cv/jamil.pdf', specialites: "angular,node js" }
  });
  const sarra = await prisma.formateur.create({
    data: { nom: 'Ben Slimen', prenom: 'Sarra', email: "sarrabs3@gmail.com", telephone: "227265505", cin: "12345678", photo: 'assets/photos/sarra.jpg', cv: 'assets/cv/sarra.pdf', specialites: "java,poo,spring Boot" }
  });
  const souha = await prisma.formateur.create({
    data: { nom: 'Dellai', prenom: 'Souha', email: "souhadellai@gmail.com", telephone: "22146305", cin: "14718820", photo: 'assets/photos/souha.jpg', cv: 'assets/cv/souha.pdf', specialites: "python,php" }
  });

  // Sessions
  const session1 = await prisma.session.create({
    data: {
      dateDebut: '2026-12-01',
      dateFin: '2026-01-07',
      description: 'Formation accélérée sur Angular, alliant théorie et pratique : de la structure modulaire aux bonnes pratiques de développement, pour produire des applications robustes et maintenables.',
      formationId: angular.id,
      formateurs: { connect: [{ id: jamil.id }, { id: souha.id }] }
    }
  });

  const session2 = await prisma.session.create({
    data: {
      dateDebut: '2026-01-01',
      dateFin: '2026-02-07',
      description: 'Devenez opérationnel en Java et POO : modélisation, encapsulation, polymorphisme et tests unitaires — à travers des exercices progressifs et un mini-projet final.',
      formationId: java.id,
      formateurs: { connect: [{ id: sarra.id }] }
    }
  });
  const session3 = await prisma.session.create({
    data: {
      dateDebut: '2026-12-08',
      dateFin: '2026-01-15',
      description: 'Découvrez Python en mode POO ! Une initiation progressive pour débutants et intermédiaires et un récap pour les avancés: de la syntaxe de base à la modélisation objet, avec des exemples concrets et un mini-projet ludique.',
      formationId: python.id,
      formateurs: { connect: [{ id: jamil.id }] }
    }
  });
  const session4 = await prisma.session.create({
    data: {
      dateDebut: '2026-01-08',
      dateFin: '2026-02-15',
      description: 'Vos premiers pas en Data Science. Une formation 100% débutante pour découvrir ce métier passionnant, apprendre à parler le langage des données et réaliser vos premières analyses. Aucun prérequis en programmation nécessaire',
      formationId: dataScience.id,
      formateurs: { connect: [{ id: sarra.id }] }
    }
  });


  const session5 = await prisma.session.create({
    data: {
      dateDebut: '2026-03-01',
      dateFin: '2026-04-15',
      heureDebut: '09:00',
      heureFin: '12:00',
      salle: 'Salle B04',
      description: 'Construisez des APIs RESTful avec Spring Boot de A à Z, avec authentification JWT et déploiement Docker.',
      formationId: springBoot.id,
      formateurs: { connect: [{ id: sarra.id }] }
    }
  });

  const session6 = await prisma.session.create({
    data: {
      dateDebut: '2026-03-10',
      dateFin: '2026-04-20',
      heureDebut: '14:00',
      heureFin: '17:00',
      salle: 'Salle A08',
      description: 'Créez des interfaces modernes avec React.js : hooks, state management et intégration API.',
      formationId: reactJs.id,
      formateurs: { connect: [{ id: jamil.id }] }
    }
  });

  const session7 = await prisma.session.create({
    data: {
      dateDebut: '2026-04-01',
      dateFin: '2026-05-10',
      heureDebut: '08:30',
      heureFin: '11:30',
      salle: 'Salle C12',
      description: 'Initiation à C# et .NET avec POO, LINQ et Entity Framework, idéale pour débutants.',
      formationId: cSharp.id,
      formateurs: { connect: [{ id: souha.id }] }
    }
  });

  const session8 = await prisma.session.create({
    data: {
      dateDebut: '2026-05-05',
      dateFin: '2026-06-20',
      heureDebut: '09:00',
      heureFin: '13:00',
      salle: 'Salle Informatique 1',
      description: 'Machine learning avec Python : modèles de classification, régression et clustering sur des données réelles.',
      formationId: machineLearning.id,
      formateurs: { connect: [{ id: souha.id }, { id: sarra.id }] }
    }
  });

  const session9 = await prisma.session.create({
    data: {
      dateDebut: '2026-02-15',
      dateFin: '2026-03-20',
      heureDebut: '10:00',
      heureFin: '12:00',
      salle: 'Salle B02',
      description: 'SQL de A à Z : conception de bases de données, requêtes complexes et optimisation avec MySQL et PostgreSQL.',
      formationId: sqlDb.id,
      formateurs: { connect: [{ id: jamil.id }] }
    }
  });

  // Candidats + Inscriptions
  const c1 = await prisma.candidat.create({ data: { nom: 'Ben Ali', prenom: 'Ahmed', email: 'ahmed.benali@email.com' } });
  const c2 = await prisma.candidat.create({ data: { nom: 'Trabelsi', prenom: 'Sana', email: 'sana.trabelsi@email.com' } });
  const c3 = await prisma.candidat.create({ data: { nom: 'Mansouri', prenom: 'Khalil', email: 'khalil.mansouri@email.com' } });
  const c4 = await prisma.candidat.create({ data: { nom: 'Gharbi', prenom: 'Ines', email: 'ines.gharbi@email.com' } });
  const c5 = await prisma.candidat.create({ data: { nom: 'Chaabane', prenom: 'Youssef', email: 'youssef.chaabane@email.com' } });
  const c6 = await prisma.candidat.create({ data: { nom: 'Riahi', prenom: 'Nadia', email: 'nadia.riahi@email.com' } });
  const c7 = await prisma.candidat.create({ data: { nom: 'Hammami', prenom: 'Fares', email: 'fares.hammami@email.com' } });
  const c8 = await prisma.candidat.create({ data: { nom: 'Boughanmi', prenom: 'Leila', email: 'leila.boughanmi@email.com' } });

  const c9  = await prisma.candidat.create({ data: { nom: 'Khelifi', prenom: 'Mariem', email: 'mariem.khelifi@email.com' } });
  const c10 = await prisma.candidat.create({ data: { nom: 'Saidi', prenom: 'Bilel', email: 'bilel.saidi@email.com' } });
  const c11 = await prisma.candidat.create({ data: { nom: 'Ferchichi', prenom: 'Amira', email: 'amira.ferchichi@email.com' } });
  const c12 = await prisma.candidat.create({ data: { nom: 'Mejri', prenom: 'Skander', email: 'skander.mejri@email.com' } });
  const c13 = await prisma.candidat.create({ data: { nom: 'Ayari', prenom: 'Dorra', email: 'dorra.ayari@email.com' } });
  const c14 = await prisma.candidat.create({ data: { nom: 'Zouaghi', prenom: 'Hichem', email: 'hichem.zouaghi@email.com' } });
  const c15 = await prisma.candidat.create({ data: { nom: 'Bchir', prenom: 'Rania', email: 'rania.bchir@email.com' } });
  const c16 = await prisma.candidat.create({ data: { nom: 'Oueslati', prenom: 'Anis', email: 'anis.oueslati@email.com' } });

  await prisma.inscription.createMany({
    data: [
      { candidatId: c1.id,  sessionId: session1.id },
      { candidatId: c2.id,  sessionId: session1.id },
      { candidatId: c3.id,  sessionId: session1.id },
      { candidatId: c9.id,  sessionId: session1.id },
      { candidatId: c4.id,  sessionId: session2.id },
      { candidatId: c5.id,  sessionId: session2.id },
      { candidatId: c10.id, sessionId: session2.id },
      { candidatId: c6.id,  sessionId: session3.id },
      { candidatId: c7.id,  sessionId: session3.id },
      { candidatId: c11.id, sessionId: session3.id },
      { candidatId: c8.id,  sessionId: session4.id },
      { candidatId: c12.id, sessionId: session4.id },
      { candidatId: c13.id, sessionId: session5.id },
      { candidatId: c14.id, sessionId: session5.id },
      { candidatId: c1.id,  sessionId: session6.id },
      { candidatId: c15.id, sessionId: session6.id },
      { candidatId: c16.id, sessionId: session7.id },
      { candidatId: c2.id,  sessionId: session8.id },
      { candidatId: c3.id,  sessionId: session9.id },
      { candidatId: c13.id, sessionId: session9.id },
    ]
  });

  //admin
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@iset.tn' },
    update: { password: passwordHash },
    create: {
      email: 'admin@iset.tn',
      password: passwordHash //password haché
    }
  });

  console.log('✅ Données initiales insérées avec succès !');

}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

