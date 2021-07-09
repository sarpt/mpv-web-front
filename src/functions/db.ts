import Dexie from 'dexie';
import 'dexie-observable';
import { Subject } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';

import type { IDatabaseChange } from 'dexie-observable/api';

const dbName = 'mpv-web-front-db';

export enum Tables {
  PlaybackHistory = 'playbackHistory',
}

export class AppDatabase extends Dexie {
  playbackHistory: Dexie.Table<PlaybackHistory, number>;

  constructor() {
    super(dbName);

    this.version(1).stores({
      playbackHistory: '++id,Path',
    });

    this.playbackHistory = this.table(Tables.PlaybackHistory);
  }
}

export interface PlaybackHistory {
  id?: number;
  Path: string;
  Title: string;
  AudioID: string;
  SubtitleID: string;
}

const db = new AppDatabase();

type DbChanges = { changes: IDatabaseChange[], partial: boolean };
const dbChangesSubject = new Subject<DbChanges>();

db.on('changes', (changes, partial) => {
  dbChangesSubject.next({ changes, partial });
});

export function getDB() {
  return db;
}

// dbChanges accumulates partial changes from dexie and only emits whole db changes
export function dbChanges() {
  return dbChangesSubject.pipe(
    scan((acc, { changes, partial }) => {
      if (acc.partial) return { changes: [...acc.changes, ...changes], partial };

      return { changes, partial };
    }, { partial: false, changes: [] as IDatabaseChange[] }),
    filter(changes => !changes.partial),
    map(({ changes }) => changes),
  );
}
