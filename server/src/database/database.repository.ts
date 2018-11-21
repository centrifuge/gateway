import * as Nedb from 'nedb';

export class DatabaseRepository<T> {
  constructor(private readonly databaseConnection: Nedb) {}

  async create(object: T) {
    return this.databaseConnection.insert(object);
  }

  async get() {
    return new Promise((res, rej) => {
      return this.databaseConnection.find({}, (err, results) => {
        if (err) {
          return rej(err);
        }

        return res(results);
      });
    });
  }
}
