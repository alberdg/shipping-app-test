import request from 'supertest';
import { app } from '../../app';

it('Returns an http 400 if empty body provided', async () => {
  await request(app)
    .post('/auth')
    .send({})
    .expect(400);
});

it('Returns an http 400 if empty password provided', async () => {
  await request(app)
    .post('/auth')
    .send({
      username: 'joe'
    })
    .expect(400);
});

it('Returns an http 400 if empty user provided', async () => {
  await request(app)
    .post('/auth')
    .send({
      password: 'abc123'
    })
    .expect(400);
});

it('Returns an http 401 if credentials are invalid', async () => {
  await request(app)
    .post('/auth')
    .send({
      username: 'a',
      password: 'b'
    })
    .expect(401);
});

it('Returns an http 302 if credentials are valid', async () => {
  await request(app)
    .post('/auth')
    .send({
      username: 'joe',
      password: 'abc123'
    })
    .expect(302);
})
