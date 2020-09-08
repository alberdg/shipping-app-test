import { orderItem } from '../../interfaces/order-item';
import { customer } from '../../interfaces/customer';
import { product } from '../../interfaces/product';
import { ordersInstance } from '../../services/orders';
import {
  readOrders,
  readProducts,
  readCustomers,
  formatOrders,
  formatOrder,
  findProductId,
  findShippingAddress,
  buildShippingDate,
} from '../';

it('Can read orders', () => {
  const orders = readOrders();
  expect(orders.length).toEqual(3);
});

it('Can read customers', () => {
  const customers = readCustomers();
  expect(customers.length).toEqual(4);
});

it('Can read products', () => {
  const products = readProducts();
  expect(products.length).toEqual(11);
});

it('Formats an array of orders', () => {
  expect(ordersInstance.orders).not.toBeNull();
  expect(ordersInstance.orders.length).toEqual(3);
  const formatted: orderItem[] = formatOrders(ordersInstance.orders);
  expect(formatted).not.toBeNull();
  expect(formatted.length).toBe(8);
});

it('Formats a single order', () => {
  const orders = ordersInstance.orders;
  expect(orders).not.toBeNull();
  const formatted: orderItem[] = formatOrder(orders[0]);
  expect(formatted).not.toBeNull();
  expect(formatted.length).toEqual(2);
});

it('Find a product id by name in an array of products', () => {
  const products: product[] = readProducts();
  const productId: number = findProductId('Blue cover', products);
  expect(productId).toEqual(13);
});

it('Find a shipping address in an array of customers', () => {
  const customers: customer[] = readCustomers();
  const address: string = findShippingAddress('Super Secret Corp', customers);
  expect(address).toEqual('520 Unknown Place, Mysterium, Secretania.');
});

it('Builds a shipping timestamp from shipping date and shipping time', () => {
  const timestamp: number = buildShippingDate('07/09/2020', '14:33');
  expect(timestamp).toEqual(1594297980000);
});
