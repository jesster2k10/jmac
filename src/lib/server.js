import * as http from 'http'
import Koa from 'koa';
import send from 'koa-send';
import Router from 'koa-router';
import serve from 'koa-static';
import { logger } from './logger'



const router = new Router();
router.get('/', async ctx => {
  await send(ctx, '/src/static/index.html')
})

const app = new Koa()
app
  .use(serve('/src/static'))
  .use(router.routes())

const server = http.createServer(app.callback());
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.emit('connected');
})

export { io };

/**
 * Creates and returns a new Koa application.
 * Does *NOT* call `listen`!
 *
 * @return {Promise<http.Server>} The configured app.
 */
export async function createServer() {
  logger.debug('Creating server...')

  // Add a `close` event listener so we can clean up resources.
  server.on('close', () => {
    // You should tear down database connections, TCP connections, etc
    // here to make sure Jest's watch-mode some process management
    // tool does not release resources.
    logger.debug('Server closing, bye!')
  })

  logger.debug('Server created, ready to listen', { scope: 'startup' })
  return server
}