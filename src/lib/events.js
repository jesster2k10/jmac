import MySQLEvents from 'mysql-events';
import { io } from './server';
import { logger } from './logger';

export function watch() {
  const config = {
    host: 'localhost',
    user: 'nodeserver',
    password: 'wkPZ6lo4GvB4tsrI',
    debug: true,
  };

  const EventWatcher = MySQLEvents(config);
  EventWatcher.add(
    `easyjet`,
    (oldRow, newRow, event) => {
      if (oldRow !== null && newRow !== null) {
        io.emit('db_updated', { oldRow, newRow });
      }
    },
    'Active'
  )

}