import request from 'supertest';
import { app } from '../../app';
const COOKIE = global.signin();

it('Returns an http 302 if user is not logged in',async () => {
  const response = await request(app)
    .get('/search?productId=13')
    .send({});
  expect(response.status).toEqual(302);
})

it('Returns order items if querying by productId', async () => {
  const response = await request(app)
    .get('/search?productId=13')
    .set('Cookie', COOKIE)
    .send({});
  expect(response.status).toEqual(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].buyer).toEqual('Doohickey Inc');
  expect(response.body[0].quantity).toEqual(5);
  expect(response.body[0].productId).toEqual(13);
  expect(response.body[0].shippingAddress).toEqual('404 Unknown Street, County, Country.');
  expect(response.body[0].shippingTarget).toEqual(1528196400000);

});

it('Returns order items if querying by customer', async () => {
  const response = await request(app)
    .get('/search?buyer=Doohickey Inc')
    .set('Cookie', COOKIE)
    .send({});
  expect(response.status).toEqual(200);
  expect(response.body.length).toBe(4);
  expect(response.body[0].buyer).toEqual('Doohickey Inc');
  expect(response.body[0].quantity).toEqual(10);
  expect(response.body[0].productId).toEqual(3);
  expect(response.body[0].shippingAddress).toEqual('404 Unknown Street, County, Country.');
  expect(response.body[0].shippingTarget).toEqual(1528196400000);
});

it('Returns order items if querying by shipping target', async () => {
  const response = await request(app)
    .get('/search?shippingtarget=1528196300000')
    .set('Cookie', COOKIE)
    .send({});
  expect(response.status).toEqual(200);
  expect(response.body.length).toBe(6);
  expect(response.body[0].buyer).toEqual('Doohickey Inc');
  expect(response.body[0].quantity).toEqual(10);
  expect(response.body[0].productId).toEqual(3);
  expect(response.body[0].shippingAddress).toEqual('404 Unknown Street, County, Country.');
  expect(response.body[0].shippingTarget).toEqual(1528196400000);
});
