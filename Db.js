const sqlite3 = require('sqlite3').verbose();

class Db {

  constructor() {
    const dbFile = 'chinook.db';

    this.db = new sqlite3.Database('chinook.db', (err) => {
      if (err) {
        console.error(err.message);
      }

      console.log('Opened database');
    });
  }

  retrieveListByFields(sql, fields) {
    const p = new Promise((resolve, reject) => {
      this.db.all(sql, fields, (err, rows) => {

        if (err) {
          reject(err);
        }

        resolve(rows);
      });
    });

    return p;
  }

  retrieveList(sql) {
    return this.retrieveListByFields(sql, []);
  }

  retrieveRowByFields(sql, fields) {
    const p = new Promise((resolve, reject) => {
      this.db.get(sql, fields, (err, row) => {
        if (err) {
          reject(err);
        }

        resolve(row);
      })
    });

    return p;
  }

  runSql(sql, params) {
    const p = new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) =>  {

        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    return p;
  }
}

exports.Db = Db;
