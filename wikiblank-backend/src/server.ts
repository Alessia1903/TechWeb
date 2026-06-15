import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { database } from './models/Database';
import { authenticationRouter } from './routers/authRouter';
import { publicRouter } from './routers/publicRouter';
import { gameRouter } from './routers/gameRouter';
import { enforceAuthentication } from './middleware/authorization';

const app = express();
const PORT = process.env.PORT || 3000;

// domini autorizzati (frontend)
const whitelist = ['http://localhost:4200'];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloccato dalle policy CORS'));
    }
  },
  optionsSuccessStatus: 200 
};

app.use(express.json());
app.use(cors(corsOptions));

// ROTTE PUBBLICHE: 
app.use('/', authenticationRouter);
app.use('/', publicRouter);

// middleware per l'autenticazione
app.use(enforceAuthentication);

// ROTTE PROTETTE
app.use('/', gameRouter);

// GESTIONE DEGLI ERRORI
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error(`La risorsa richiesta (${req.originalUrl}) non esiste.`);
  error.status = 404;
  next(error); 
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Errore catturato:", err);
  
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({ error: message });
});

// AVVIO DEL SERVER
app.listen(PORT, async () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
  try {
    await database.authenticate();
    console.log('Connessione al database stabilita con successo.');
  } catch (error) {
    console.error('Impossibile connettersi al database:', error);
  }
});