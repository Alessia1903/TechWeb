import express, { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/AuthController"; 

export const authenticationRouter = express.Router();

// Login
authenticationRouter.post("/auth", async (req: Request, res: Response) => {
  let isAuthenticated = await AuthController.checkCredentials(req, res);
  
  if (isAuthenticated) {
    res.json({ token: AuthController.issueToken(req.body.usr) });
  } else {
    res.status(401);
    res.json({ error: "Invalid credentials. Try again." });
  }
});

// Crea nuovo utente
authenticationRouter.post("/signup", (req: Request, res: Response, next: NextFunction) => {
  AuthController.saveUser(req, res).then((user: any) => {
    res.json(user);
  }).catch((err: any) => {
    next({ status: 500, message: "Could not save user" });
  });
});