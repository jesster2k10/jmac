require('babel-polyfill');
require('babel-register');

import { createServer } from '../lib/server'
import { env } from '../lib/env'
import { logger } from '../lib/logger'
import { watch } from '../lib/events'

createServer().then(
  app =>
    app.listen(env.PORT, () => {
      const mode = env.NODE_ENV
      logger.debug(`Server listening on ${env.PORT} in ${mode} mode`)
      watch();
    }),
  err => {
    logger.error('Error while starting up server', err)
    process.exit(1)
  }
)