import MySQLEvents from 'mysql-events';
import { logger } from './logger';
import * as admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flight-45d3b.firebaseio.com"
});

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
        logger.debug('New event');

        const data = newRow.fields;
        if (data.notice && data.notice.length > 1) {
          logger.debug('Saving to Firebase');

          const db = admin.database();
          const ref = db.ref(`/mysql_data/${data.uid}`)
          ref.push().set(data);
        }
      }
    },
    'Active'
  )

}