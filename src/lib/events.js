import MySQLEvents from 'mysql-events';
import mysql from 'mysql';
import { logger } from './logger';
import { env } from './env';

export function watch() {
  const config = {
    host: 'localhost',
    user: 'root',
    password: '',
  };

  const EventWatcher = MySQLEvents(config);
  EventWatcher.add(
    `easyjet.data.notice.value`,
    (oldRow, newRow, event) => {
      if (oldRow === null) {
        logger.debug('Added new row to table');
      }
   
      if (newRow === null) {
        logger.debug('Deleted a row from table');
      }
   
      if (oldRow !== null && newRow !== null) {
        logger.debug('Updated a row from table');
      }
    },
  )

}