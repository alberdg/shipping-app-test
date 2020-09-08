import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json, urlencoded } from 'body-parser';
import path from 'path';
import cookieSession from 'cookie-session';
import { authRouter } from './routes/auth';
import { showRouter } from './routes/show';
import { uploadRouter } from './routes/upload';
import { searchRouter } from './routes/search';
import { logoutRouter } from './routes/logout';
import { currentUser } from './common/middlewares/current-user';
import { errorHandler } from './common/middlewares/error-handler';
import { requireAuth } from './common/middlewares/require-auth';
import { NotFoundError } from './common/errors/not-found-error';
import io from 'socket.io';
import { Server } from 'http';
import { filterOrderInformation } from './utils';
import { ordersInstance } from './services/orders';
const app = express();
export const httpServer = new Server(app);
const ioServer = io(httpServer);

// Listen for socket io connection
ioServer.on('connection', (socket) => {
  // On client subscribe send our current info
  socket.on('subscribe', (data: string) => {
    filterOrderInformation(JSON.parse(data), ordersInstance);
  });
})

app.set('trust proxy', true);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false,
    secure: false,
    path: '/'
  })
);

/**
 * Protects the given route to be available only for authenticated users
 * @function
 * @param  route Route to be protected
 */
const protectStaticRoute = (route: string) : void => {
  app.use(route, currentUser, requireAuth, express.static( path.join( __dirname, route ) ) );
}

// Route protection
protectStaticRoute('/home.html');
protectStaticRoute('/upload.html');
protectStaticRoute('/show.html');
protectStaticRoute('/search.html');
protectStaticRoute('/live.html');

// Attaching routers
app.use(authRouter);
app.use(showRouter);
app.use(uploadRouter);
app.use(searchRouter);
app.use(logoutRouter);
app.use(express.static('static'));

// Other routes handler
app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError();
});

// Attaching error handler
app.use(errorHandler);

export { ioServer, app };
