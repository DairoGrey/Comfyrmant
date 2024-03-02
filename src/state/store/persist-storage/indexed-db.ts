import Dexie, { Table } from 'dexie';
import { Storage } from 'redux-persist';

export interface Data {
  slice: string;
  bucket: string;
  state: unknown;
}

export class PersistDexie extends Dexie {
  data!: Table<Data>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      data: 'slice,bucket',
    });
  }
}

function storage(dbName: string): Storage {
  const db = new PersistDexie(dbName);

  return {
    getItem: (key) => {
      return db.data
        .where({ bucket: key })
        .toArray((records) => records.reduce((result, { slice, state }) => ({ ...result, [slice]: state }), {}));
    },
    setItem: (key, value) => {
      return Promise.allSettled(
        Object.entries(value).map(([slice, state]) => db.data.put({ bucket: key, slice, state })),
      );
    },
    removeItem: (key) => {
      return db.data.where({ bucket: key }).delete();
    },
  } satisfies Storage;
}

export default storage;
