import { Request, Response } from 'express';
import { Game, User } from '../models/Database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
  
  static async saveUser(req: Request, res: Response) {
    let user = User.build({
      userName: req.body.usr, 
      password: req.body.pwd
    });
    // .save() fa scattare l'hook "beforeCreate" che applica random salt 
    return user.save();
  }

  static async checkCredentials(req: Request, res: Response): Promise<boolean> {
    const user = await User.findOne({ 
      where: { userName: req.body.usr } 
    });
    if (!user) return false;
    
    return await bcrypt.compare(req.body.pwd, user.getDataValue('password'));
  }

  /**
   * Rilascia JWT per utente autenticato
   */
  static issueToken(username: string) {
    const secret = process.env.TOKEN_SECRET || 'segreto-di-riserva-locale';
    return jwt.sign({ user: username }, secret, { expiresIn: '24h' });
  }

  /**
   * Verifica se il token è valido
   */
  static isTokenValid(token: string, callback: any) {
    const secret = process.env.TOKEN_SECRET || 'segreto-di-riserva-locale';
    jwt.verify(token, secret, callback);
  }

  /**
   * Controlla se l'utente ha i permessi per modificare un certo gioco
   */
  static async canUserModifyGame(username: string, gameId: string | number): Promise<boolean> {
    const game = await Game.findByPk(gameId);
    const user = await User.findOne({ where: { username: username } });
    // Verifichiamo che gioco e utente esistano e che appartenga all'utente
    return !!game && !!user && (game as any).userId === (user as any).id;
  }
}