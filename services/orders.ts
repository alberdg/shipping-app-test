import { order } from '../interfaces/order';
import { readOrders } from '../utils';
import { ordersFormatterInstance } from './orders-formatter';
/**
 * Singleton class to keep track of orders
 * @class
 */
class Order {
  private _orders: order[] = [];

  constructor () {
    this.initializeOrders();
  }

  /**
   * Orders getter
   * @function
   * @returns orders Array of orders
   */
  public get orders() : order[] {
    return this._orders;
  }

  /**
   * Adds an order to our in memory array
   * @function
   * @param order Order to be added
   */
  addOrder (order: order) : void {
    this._orders.push(order);
    ordersFormatterInstance.addOrder(order);
  }

  /**
   * Initialize orders with JSON file contents
   * @function
   */
  initializeOrders () : void {
    try {
      this._orders = readOrders();
      ordersFormatterInstance.orders = this._orders;
    } catch (err) {
      this._orders = [];
      console.error(err);
    }
  }
}

// Export singleton
export const ordersInstance = new Order();
