import express, { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/AuthController"; 

export const authenticationRouter = express.Router();

/**
 * @swagger
 *  /auth:
 *    post:
 *      description: Authenticate user
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: user credentials to authenticate
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                usr:
 *                  type: string
 *                  example: Kyle
 *                pwd:
 *                  type: string
 *                  example: p4ssw0rd
 *      responses:
 *        200:
 *          description: User authenticated
 *        401:
 *          description: Invalid credentials
 */
authenticationRouter.post("/auth", async (req: Request, res: Response) => {
  let isAuthenticated = await AuthController.checkCredentials(req, res);
  
  if (isAuthenticated) {
    res.json({ token: AuthController.issueToken(req.body.usr) });
  } else {
    res.status(401);
    res.json({ error: "Invalid credentials. Try again." });
  }
});

authenticationRouter.post("/signup", (req: Request, res: Response, next: NextFunction) => {
  AuthController.saveUser(req, res).then((user: any) => {
    res.json(user);
  }).catch((err: any) => {
    next({ status: 500, message: "Could not save user" });
  });
});