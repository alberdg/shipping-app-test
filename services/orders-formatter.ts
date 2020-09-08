import { orderItem } from '../interfaces/order-item';
import { order } from '../interfaces/order';
import { formatOrders, formatOrder } from '../utils';

/**
 * Singleton class to keep track of orders
 * @class
 */
class OrderFormatter {
  private _orderItems: orderItem[] = [];
  constructor () {
  }

  public set orders(unformattedOrders: order[]) {
    this._orderItems = formatOrders(unformattedOrders);
  }

  /**
   * Orders getter
   * @function
   * @returns orders Array of orders
   */
  public get orderItems() : orderItem[] {
    return this._orderItems;
  }

  /**
   * Formats and adds an order to our in memory array
   * @function
   * @param order Order to be added
   */
  addOrder (order: order) : void {
    const orderItems: orderItem[] = formatOrder(order);
    this._orderItems = [ ...this._orderItems, ...orderItems ];
  }
}

// Export singleton
export const ordersFormatterInstance = new OrderFormatter();
