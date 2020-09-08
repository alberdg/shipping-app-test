import express, { Request, Response } from 'express';
import { order } from '../interfaces/order';
import { currentUser } from '../common/middlewares/current-user';
import { requireAuth } from '../common/middlewares/require-auth';
import { ordersInstance } from '../services/orders';
import { ordersFormatterInstance } from '../services/orders-formatter';
const router = express.Router();


router.post(
  '/upload',
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    const newOrder: order = req.body;
    ordersInstance.addOrder(newOrder);
    res.send(ordersFormatterInstance.orderItems);
  }
);

export { router as uploadRouter };
