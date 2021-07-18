import Dexie from 'dexie';
import 'dexie-observable';
import { Subject } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';

import type { IDatabaseChange } from 'dexie-observable/api';

const dbName = 'mpv-web-front-db';

export enum Tables {
  PlaybackHistory = 'playbackHistory',
}

export enum PlaybackHistoryColumns {
  Id = 'id',
  Path = 'Path',
  Title = 'Title',
  AudioID = 'AudioID',
  SubtitleID = 'SubtitleID',
}

export class AppDatabase extends Dexie {
  playbackHistory: Dexie.Table<PlaybackHistoryEntry, number>;

  constructor() {
    super(dbName);

    this.version(1).stores({
      playbackHistory: `++${PlaybackHistoryColumns.Id},${PlaybackHistoryColumns.Path}`,
    });

    this.playbackHistory = this.table(Tables.PlaybackHistory);
  }
}

export interface PlaybackHistoryEntry {
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
