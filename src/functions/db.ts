import Dexie from 'dexie';

export class AppDatabase extends Dexie {
  playbackHistory: Dexie.Table<PlaybackHistory, number>;

  constructor() {
    super('mpv-web-front-db');

    this.version(1).stores({
      playbackHistory: '++id, path, title, audioID, subtitleID',
    });

    this.playbackHistory = this.table('playbackHistory');
  }
}

export interface PlaybackHistory {
  id?: number;
  Path: string;
  Title: string;
  AudioID: string;
  SubtitleID: string;
}

let db = new AppDatabase();

export function initDB() {
  db = new AppDatabase();
}

export function getDB() {
  return db ?? undefined;
}
