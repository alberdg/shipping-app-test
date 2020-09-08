import { item } from './item';
export interface order {
  buyer: string;
  items: item[];
  orderDate: string;
  orderTime: string;
  shippingDate: string;
  shippingTime: string;
  saleRoute: string;
};
