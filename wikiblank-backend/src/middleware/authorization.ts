import { Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';

/**
 * This middleware ensures that the user is currently authenticated. If not,
 * redirects to login with an error message.
 */
export function enforceAuthentication(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) {
    next({ status: 401, message: "Unauthorized" });
    return;
  }
  AuthController.isTokenValid(token, (err: any, decodedToken: any) => {
    if (err) {
      next({ status: 401, message: "Unauthorized" });
    } else {
      (req as any).username = decodedToken.user;
      next();
    }
  });
}

/**
 * Assicuriamoci che l'utente modifichi solo i propri Giochi
 */
export async function ensureUsersModifyOnlyOwnGames(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).username;
  const gameId = req.params.id; 
  const userHasPermission = await AuthController.canUserModifyGame(user, gameId as string);
  if (userHasPermission) {
    next();
  } else {
    next({
      status: 403, 
      message: "Forbidden! You do not have permissions to view or modify this resource"
    });
  }
}