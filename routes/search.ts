import express, { Request, Response } from 'express';
import { orderItem } from '../interfaces/order-item';
import { currentUser } from '../common/middlewares/current-user';
import { requireAuth } from '../common/middlewares/require-auth';
import { ordersFormatterInstance } from '../services/orders-formatter';
const router = express.Router();


router.get(
  '/search',
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    const { productId, buyer, shippingtarget } = req.query;
    let orderItems: orderItem[] = ordersFormatterInstance.orderItems;
    // Product id filtering
    if (productId) {
      orderItems = orderItems.filter((orderItem: orderItem) => orderItem.productId.toString() === productId);
    }

    // Buyer filtering
    if (buyer) {
      orderItems = orderItems.filter((orderItem: orderItem) => orderItem.buyer === buyer);
    }

    // Shipping target filtering
    if (shippingtarget) {
      orderItems = orderItems.filter((orderItem: orderItem) => orderItem.shippingTarget > parseFloat(shippingtarget.toString()))
    }
    res.send(orderItems);
  }
);

export { router as searchRouter };
