import express, { Request, Response, NextFunction } from "express";
import { GameController } from "../controllers/GameController";

export const publicRouter = express.Router();

// Classifica generale
publicRouter.get("/leaderboard", (req: Request, res: Response, next: NextFunction) => {
  GameController.getLeaderboard(req)
    .then(data => res.json(data))
    .catch(err => next(err));
});

// Lista delle partite concluse
publicRouter.get("/archive", (req: Request, res: Response, next: NextFunction) => {
  GameController.getCompletedGames(req)
    .then(data => res.json(data))
    .catch(err => next(err));
});

// Dettaglio di una singola partita conclusa
publicRouter.get("/archive/:id", (req: Request, res: Response, next: NextFunction) => {
  GameController.getCompletedGameDetails(req)
    .then(data => res.json(data))
    .catch(err => next(err));
});