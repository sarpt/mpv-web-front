import { filter, map, pairwise, startWith, withLatestFrom } from 'rxjs/operators';

import type { MoviesMap, Playback } from '../models/api';
import { dbChanges, getDB, PlaybackHistoryColumns, PlaybackHistoryEntry, Tables } from './db';

import { getPlaybackSse, getMoviesSse } from './sse';

export function initPlaybackHistoryWatch() {
  getPlaybackSse()
    .pipe(
      startWith(undefined),
      pairwise(),
      withLatestFrom(getMoviesSse()),
    )
    .subscribe(updatePlaybackHistory);
}

async function updatePlaybackHistory([[prevPlayback, newPlayback], movies]: [[Playback | undefined, Playback | undefined],  MoviesMap]) {
  if (!newEntry(prevPlayback, newPlayback)) return;

  const currentHistoryEntryId = await currentEntryId();

  const newMovie = movies[newPlayback!.MoviePath];
  putEntryInHistory({
    Path: newMovie.Path,
    Title: newMovie.Title,
    AudioID: newPlayback!.SelectedAudioID,
    SubtitleID: newPlayback!.SelectedSubtitleID,
  });

  // TODO: currently the playback history only refreshes mid-playback changes on the change on entry
  // (which makes currently playing entry have wrong information about playback)
  // To add some diffing mechanism.
  if (!prevPlayback || currentHistoryEntryId < 0) return;

  updateEntryInHistory(currentHistoryEntryId, {
    AudioID: prevPlayback.SelectedAudioID,
    SubtitleID: prevPlayback.SelectedSubtitleID,
  });
}

function putEntryInHistory(entry: PlaybackHistoryEntry) {
  const db = getDB();
  if (!db) return 0;

  return db.playbackHistory.put(entry);
}

function updateEntryInHistory(id: number, changes: Partial<PlaybackHistoryEntry>) {
  const db = getDB();
  if (!db) return 0;

  return db.playbackHistory
    .where(PlaybackHistoryColumns.Id)
    .equals(id)
    .modify(changes);
}

async function currentEntryId() {
  const db = getDB();
  if (!db) return -1;

  const currentEntry = await db.playbackHistory
    .toCollection()
    .last();
  if (!currentEntry) return -1;

  return currentEntry.id ?? -1;
}

function newEntry(prevPlayback: Playback | undefined, newPlayback: Playback | undefined): boolean {
  if (prevPlayback && newPlayback) return prevPlayback.MoviePath !== newPlayback.MoviePath;

  return !!newPlayback;
}

export function getPlaybackHistory() {
  return getDB().playbackHistory.reverse().toArray()
    ?? [] as PlaybackHistoryEntry[];
}

export function playbackHistoryChanges() {
  return dbChanges().pipe(
    map(changes => {
      return changes.filter(change => change.table === Tables.PlaybackHistory);
    }),
    filter(changes => changes.length !== 0),
  );
}
