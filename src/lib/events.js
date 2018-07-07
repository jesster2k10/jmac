import MySQLEvents from 'mysql-events';
import mysql from 'mysql';
import ZongJi from 'zongji';
import { logger } from './logger';

export function watch() {
  const config = {
    host: 'localhost',
    user: 'nodeserver',
    password: 'wkPZ6lo4GvB4tsrI',
    debug: true,
  };

  var zongji = new ZongJi(config);
  zongji.on('binlog', function(evt) {
    evt.dump();
  });

  zongji.on('error', function(error) {
    if (error.code == 'PROTOCOL_CONNECTION_LOST') {
      logger.debug(error);
      zongji.start({
        includeEvents: ['tablemap', 'writerows', 'updaterows', 'deleterows']
      });
    } else {
      throw error;
    }
  })

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