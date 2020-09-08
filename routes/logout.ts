import express, { Request, Response } from 'express';
const router = express.Router();

router.post(
  '/logout',
  (req: Request, res: Response) => {
        // Store it on session object
    req.session = {
      jwt: null
    };
    res.send({});
  }
);

export { router as logoutRouter };
