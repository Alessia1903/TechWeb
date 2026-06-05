import express, { Request, Response, NextFunction } from "express";
import { GameController } from "../controllers/GameController";
import { ensureUsersModifyOnlyOwnGames } from "../middleware/authorization"; 

export const gameRouter = express.Router();

// Partite personali
gameRouter.get("/games", (req: Request, res: Response, next: NextFunction) => {
  GameController.getGamesForCurrentUser(req).then(games => {
    res.json(games);
  }).catch(err => {
    next(err);
  });
});

// Inizia nuova partita
gameRouter.post("/games/start", (req: Request, res: Response, next: NextFunction) => {
  GameController.startNewGame(req).then(game => {
    res.json(game);
  }).catch(err => {
    next(err);
  });
});

// Recupera info partita
gameRouter.get("/games/:id", ensureUsersModifyOnlyOwnGames, (req: Request, res: Response, next: NextFunction) => {
  GameController.findById(req).then((item) => {
    if (item)
      res.json(item);
    else 
      next({ status: 404, message: "Game not found" });
  }).catch(err => {
    next(err);
  });
});

// Tentativo parola
gameRouter.post("/games/:id/guess", ensureUsersModifyOnlyOwnGames, (req: Request, res: Response, next: NextFunction) => {
  GameController.guessWord(req).then(result => {
    res.json(result);
  }).catch(err => {
    next(err);
  });
});

// Resa
gameRouter.post("/games/:id/surrender", ensureUsersModifyOnlyOwnGames, (req: Request, res: Response, next: NextFunction) => {
  GameController.surrender(req).then(result => {
    res.json(result);
  }).catch(err => {
    next(err);
  });
});