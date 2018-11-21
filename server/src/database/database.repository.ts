import * as Nedb from 'nedb';
import * as util from 'util';

export class DatabaseRepository<T> {
  constructor(private readonly databaseConnection: Nedb) {}

  async create(object: T) {
    return this.databaseConnection.insert(object);
  }

  async get() {
    const cursor = this.databaseConnection.find({});
    return util.promisify(cursor.exec.bind(cursor))();
  }
}
