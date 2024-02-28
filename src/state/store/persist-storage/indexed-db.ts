import Dexie, { Table } from 'dexie';
import { Storage } from 'redux-persist';

export interface Data {
  bucket: string;
  state: unknown;
}

export class PersistDexie extends Dexie {
  data!: Table<Data>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      data: 'bucket',
    });
  }
}

function storage(dbName: string): Storage {
  const db = new PersistDexie(dbName);

  return {
    getItem: (key) => {
      return db.data
        .where({ bucket: key })
        .first()
        .then((item) => (item ? item.state : undefined));
    },
    setItem: (key, value) => {
      return db.data.put({ bucket: key, state: value });
    },
    removeItem: (key) => {
      return db.data.where({ bucket: key }).delete();
    },
  } satisfies Storage;
}

export default storage;
