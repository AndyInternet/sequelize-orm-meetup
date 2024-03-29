require('dotenv').config();
require('pretty-error').start();
import { Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { init } from './init';
import { authorsView, storiesView, storiesViewLogged } from './views';

// init express app and global middleware
const app = init();

// call to root
app.get('/', (req, res) => {
  return res.json({ message: 'SHALL WE PLAY A GAME?' });
});

// health check endpoint
app.get('/ping', (req, res) => {
  return res.status(200).json({ message: 'service running' });
});

// fetch all authors and stories
app.get('/all', async (req, res) => {
  const [authors, stories] = await Promise.all([authorsView(), storiesView()]);
  return res.json({ authors, stories });
});

// catch 404
app.use(function (req, res) {
  return res.status(404).json({ message: 'Invalid route (404)' });
});

// error handler
app.use(function (err: HttpError, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message || 'internal server error' });
});

export default app;
