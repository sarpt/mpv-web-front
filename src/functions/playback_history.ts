import { pairwise, startWith, withLatestFrom } from 'rxjs/operators';

import type { MoviesMap, Playback } from '../models/api';
import { getDB, PlaybackHistory } from './db';

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

function updatePlaybackHistory([[prevPlayback, newPlayback], movies]: [[Playback | undefined, Playback | undefined],  MoviesMap]) {
  if (!newEntry(prevPlayback, newPlayback)) return;

  const newMovie = movies[newPlayback!.MoviePath];
  putEntryInHistory({
    Path: newMovie.Path,
    Title: newMovie.Title,
    AudioID: newPlayback!.SelectedAudioID,
    SubtitleID: newPlayback!.SelectedSubtitleID,
  });

  // TODO: currently the playback history only refreshes mid-playback changes on the change on entry.
  // To add some diffing mechanism.
  if (!prevPlayback) return;

  updateEntryInHistory(prevPlayback.MoviePath, {
    AudioID: prevPlayback.SelectedAudioID,
    SubtitleID: prevPlayback.SelectedSubtitleID,
  });
}

function putEntryInHistory(entry: PlaybackHistory) {
  getDB()
    .playbackHistory
    .put(entry);
}

function updateEntryInHistory(path: string, changes: Partial<PlaybackHistory>) {
  getDB()
    .playbackHistory
    .where('Path')
    .equals(path)
    .modify(changes);
}

function newEntry(prevPlayback: Playback | undefined, newPlayback: Playback | undefined): boolean {
  if (prevPlayback && newPlayback) return prevPlayback.MoviePath !== newPlayback.MoviePath;

  return !!newPlayback;
}

// TODO: currently PlaybackHistory does not refresh on new entries.
// To add some observable/svelte store mechanism to inform Svelte components on changes.
export async function getPlaybackHistory() {
  return getDB().playbackHistory.reverse().toArray();
}
