import request from 'supertest';
import { app } from '../../app';
const COOKIE = global.signin();

it('Returns an http 302 if user is not logged in',async () => {
  const response = await request(app)
    .get('/show')
    .send({});
  expect(response.status).toEqual(302);
})

it('Returns orders formatted', async () => {
  const response = await request(app)
    .get('/show')
    .set('Cookie', COOKIE)
    .send({});
  expect(response.status).toEqual(200);
  expect(response.body).not.toBeNull();
  expect(response.body.length).toEqual(8);
  expect(response.body[0].buyer).toEqual('Sprocket Corp');
  expect(response.body[0].quantity).toEqual(20);
  expect(response.body[0].productId).toEqual(2);
  expect(response.body[0].shippingAddress).toEqual('123 Smith Street, County, Country.');
  expect(response.body[0].shippingTarget).toEqual(1527505200000);
});
