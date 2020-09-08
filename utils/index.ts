import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { ioServer } from '../app';
import { order } from '../interfaces/order';
import { orderItem } from '../interfaces/order-item';
import { product } from '../interfaces/product';
import { customer } from '../interfaces/customer';
import { item } from '../interfaces/item';
import { user } from '../interfaces/user';
import OrderItemFactory from '../factories/order-item';

const ORDERS_FILE_NAME = 'orders';
const CUSTOMERS_FILE_NAME = 'customers';
const PRODUCTS_FILE_NAME = 'products';
const USERS_FILE_NAME = 'users';
/**
 * Reads elements from json file
 * @function
 * @returns result Array of objects
 */
export const readJSONFile = (name: string) : any[] => {
  let result = null;
  try {
    result = readFileSync(`${__dirname}/../${name}.json`, 'utf8');
  } catch (err) {
    console.error(err);
    result = '[]';
  }
  return JSON.parse(result);
}

/**
 * Reads orders file
 * @function
 * @returns orders Orders read from file
 */
export const readOrders = () : order[] => {
  return readJSONFile(ORDERS_FILE_NAME);
}

/**
 * Reads users file
 * @function
 * @returns users Users read from file
 */
export const readUsers = () : user[] => {
  return readJSONFile(USERS_FILE_NAME);
}

/**
 * Reads products file
 * @function
 * @returns products Products read from file
 */
export const readProducts = () : product[] => {
  return readJSONFile(PRODUCTS_FILE_NAME);
}

/**
 * Reads customers file
 * @function
 * @returns customers Customers read from file
 */
export const readCustomers = () : customer[] => {
  return readJSONFile(CUSTOMERS_FILE_NAME);
}

/**
 * Formats the given orders
 * @function
 * @param orders Array of orders
 * @returns items Array of order items
 */
export const formatOrders = (orders: order[]) : orderItem[] => {
  let items: orderItem[] = [];
  orders.forEach((order: order) => {
    const orderItems: orderItem[] = formatOrder(order);
    items = [ ...items, ...orderItems ];
  })
  return items;
}

/**
 * Formats a single order
 * @function
 * @param order Order to be formatted
 * @returns items Order items formatted
 */
export const formatOrder = (order: order) : orderItem[] => {
  if (!order || !Array.isArray(order.items) || order.items!.length === 0) return [];
  const items: orderItem[] = [];
  const products: product[] = readProducts();
  const customers: customer[] = readCustomers();
  order.items!.forEach((element: item) => {
    const newOrderItem =  OrderItemFactory.build(
      order.buyer,
      element.item,
      element.quantity,
      order.shippingDate,
      order.shippingTime,
      products,
      customers,
    );
    items.push(newOrderItem);
  });
  return items;
}

/**
 * Finds product id in products array
 * @function
 * @param item Item name
 * @param products Products array
 * @returns productId product Id
 */
export const findProductId = (item: string, products: product[]) : number => {
  const product = products.find(product => product.name === item);
  if (!product) return -1;
  return product.productId;
}

/**
 * Finds customer address in customers array
 * @function
 * @param buyer Buyer name
 * @param customers Customers array
 * @returns address Customer shipping address
 */
export const findShippingAddress = (buyer: string, customers: customer[]) : string => {
  const customer: any = customers.find((item: customer) => item.name === buyer);
  if (!customer) return '';
  return customer.address;
}

/**
 * Gets timestamp from shipping date and time
 * @function
 * @param shippingDate Shipping Date
 * @param  shippingTime Shipping Time
 * @returns timestamp Shipping timestamp
 */
export const buildShippingDate = (shippingDate: string, shippingTime: string) : number => {
  const dateTime = `${shippingDate} ${shippingTime}`;
  return new Date(dateTime).getTime();
}

/**
 * Emits a message to all clients
 * @function
 * @param channel Channel to send message to
 * @param msg Message to send
 */
const emit = (channel: string, msg: string) : void => {
  ioServer.emit(channel, msg);
}

/**
 * Filters order information to be sent through socket.io
 * @function
 * @param data Product ids to emit for
 */
export const filterOrderInformation = (data: number[], ordersInstance: any) : void => {
  if (Array.isArray(data) && data.length > 0) {
    const orders: orderItem[] = formatOrders(ordersInstance.orders);
    data.forEach((productId: number) => {
      orders.forEach((orderElement: orderItem) => {
        if (orderElement.productId === productId) {
          emit('order', JSON.stringify(orderElement));
        }
      });
    });
  }
}

/**
 * Persists all orders in memory to json file
 * @function
 * @param orderInstance Order class instance
 */
export const persistOrders = (ordersInstance: any) : void => {
  const fileName = `${ORDERS_FILE_NAME}.json`;
  const orders = ordersInstance.orders;
  // Remove orders.json
  unlinkSync(`${__dirname}/../${fileName}`);

  // Recreate orders.json with new orders
  writeFileSync(fileName, JSON.stringify(orders), 'utf8');
}
