import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { readUsers } from '../utils';
import { user } from '../interfaces/user';
import { validateRequest } from '../common/middlewares/validate-request';
import { NotAuthorizedError } from '../common/errors/not-authorized-error';

const router = express.Router();

router.post(
  '/auth',
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('You must supply a username'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validateRequest,
  (req: Request, res: Response) => {
    const { username, password } = req.body;
    const users: user[] = readUsers();

    const userResult: user = users.find((item: user) => item.username === username && item.password === password)!;
    if (!userResult) {
      throw new NotAuthorizedError();
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        username: userResult.username,
        password: userResult.password
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt
    };
    res.redirect('/home.html');
  }
);

export { router as authRouter };
