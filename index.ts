import { httpServer } from './app';
import { persistOrders } from './utils';
import { ordersInstance } from './services/orders';
const HTTP_PORT = 8080;

if (!process.env.JWT_KEY) {
  throw new Error('JWT_KEY must be provided');
}


httpServer.listen(HTTP_PORT, () => {
  console.log(`Listening at ${HTTP_PORT}`);
});

// Make sure data is persisted to file system on process termination
process.on('SIGTERM', () => persistOrders(ordersInstance));
process.on('SIGINT', () => persistOrders(ordersInstance));
