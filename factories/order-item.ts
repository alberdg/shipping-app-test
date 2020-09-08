import { orderItem } from '../interfaces/order-item';
import { product } from '../interfaces/product';
import { customer } from '../interfaces/customer';
import {
  findProductId,
  findShippingAddress,
  buildShippingDate
} from '../utils';


abstract class OrderItemFactory {

  static build (buyer: string, item: string, quantity: number, shippingDate: string,
    shippingTime: string, products: product[], customers: customer[]) : orderItem {
    return {
      buyer,
      quantity,
      productId: findProductId(item, products),
      shippingAddress: findShippingAddress(buyer, customers),
      shippingTarget: buildShippingDate(shippingDate, shippingTime)
    };
  }
}

export default OrderItemFactory;
