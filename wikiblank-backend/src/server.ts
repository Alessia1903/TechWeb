import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { database } from './models/Database';
import { authenticationRouter } from './routers/authRouter';
import { publicRouter } from './routers/publicRouter';
import { gameRouter } from './routers/gameRouter';
import { enforceAuthentication } from './middleware/authorization';

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE DI BASE: permette a Express di leggere i dati JSON inviati nel req.body (come usr e pwd)
app.use(express.json());
// MIDDLEWARE CORS: consente al frontend (che gira su un dominio/porta diversa) di comunicare con questo backend
app.use(cors());
// ROTTE PUBBLICHE: (login e signup) accessibili a tutti senza token
app.use('/', authenticationRouter);
app.use('/', publicRouter);

// PROTEZIONE GLOBALE: le rotte richiederanno l'autenticazione
app.use(enforceAuthentication);

// ROTTE PROTETTE: ci arrivi solo se il middleware sopra dà il via libera
app.use('/', gameRouter);

// GESTIONE GLOBALE DEGLI ERRORI
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Errore catturato:", err);
  
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({ error: message });
});

// AVVIO DEL SERVER
app.listen(PORT, async () => {
  console.log(`🚀 Server in esecuzione sulla porta ${PORT}`);
  try {
    await database.authenticate();
    console.log('✅ Connessione al database stabilita con successo.');
  } catch (error) {
    console.error('❌ Impossibile connettersi al database:', error);
  }
});