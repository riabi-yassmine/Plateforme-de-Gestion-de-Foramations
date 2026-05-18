import express from 'express';
import formationsRoute from './routes/formations.route';
import cors from 'cors';
import formateursRoute from './routes/formateurs.route';
import sessionsRoute from './routes/sessions.route';
import inscriptionsRoute from './routes/inscriptions.route';
import { PrismaClient } from '@prisma/client';
import candidatsRoute from './routes/candidats.route';
import adminRoute from './routes/admin.route';
import { stat } from 'node:fs';
import statsRoute from './routes/stats.route';
export const prisma=new PrismaClient();
const app = express();//création de l'app Express(app server backend)
const PORT = 3000;//port d'écoute de serveur



app.use(cors()); //middleware pour cors(autoriser les requétes cross-origin)
app.use(express.json());//middleware pour le JSON
app.use('/api/formations', formationsRoute);//route pour les formations
app.use('/api/formateurs', formateursRoute);
app.use('/api/sessions',sessionsRoute);
app.use('/api/inscriptions',inscriptionsRoute);
app.use('/api/candidats',candidatsRoute);
app.use('/api/admin',adminRoute);
app.use('/api/stats',statsRoute);
//démarrage de serveur
app.listen(PORT, () => {
  console.log(`Backend démarré sur http://localhost:${PORT}`);
});
