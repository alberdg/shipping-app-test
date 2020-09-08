import express, { Request, Response } from 'express';
import { currentUser } from '../common/middlewares/current-user';
import { requireAuth } from '../common/middlewares/require-auth';
import { ordersFormatterInstance } from '../services/orders-formatter';
const router = express.Router();


router.get(
  '/show',
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    res.send(ordersFormatterInstance.orderItems);
  }
);

export { router as showRouter };
