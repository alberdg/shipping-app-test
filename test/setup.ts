import jwt from 'jsonwebtoken';
import { user } from '../interfaces/user';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}
process.env.JWT_KEY = 'asdfasdf';


 global.signin = () => {
   // Build a jwt payload
   const payload: user = { username: 'joe', password: 'abc123' };
   // Create jwt
   const token = jwt.sign(payload, process.env.JWT_KEY!);

   // Build session Object
   const session = { jwt: token };

   // Turn that session into json
   const sessionJSON = JSON.stringify(session);

   // Take json and encode it as base64
   const base64 = Buffer.from(sessionJSON).toString('base64');

   // Return a string thats the cookie with the session data
   return [`express:sess=${base64}`];
 };
