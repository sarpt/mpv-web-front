import { pairwise, withLatestFrom } from 'rxjs/operators';

import type { MoviesMap, Playback } from '../models/api';
import { getDB, PlaybackHistory } from './db';

import { getPlaybackSse, getMoviesSse } from './sse';

export function initPlaybackHistoryWatch() {
  getPlaybackSse()
    .pipe(
      pairwise(),
      withLatestFrom(getMoviesSse()),
    )
    .subscribe(updatePlaybackHistory);
}

function updatePlaybackHistory([[prevPlayback, newPlayback], movies]: [[Playback | undefined, Playback | undefined],  MoviesMap]) {
  if (!newPlayback) return;

  const newEntry = !prevPlayback ||prevPlayback.MoviePath !== newPlayback.MoviePath;
  if (newEntry) {
    const newMovie = movies[newPlayback.MoviePath];
    addEntryToHistory({
      Path: newMovie.Path,
      Title: newMovie.Title,
      AudioID: newPlayback.SelectedAudioID,
      SubtitleID: newPlayback.SelectedSubtitleID,
    });

    return;
  }

  updateEntryInHistory(newPlayback.MoviePath, {
    AudioID: newPlayback.SelectedAudioID,
    SubtitleID: newPlayback.SelectedSubtitleID,
  });
}

function addEntryToHistory(entry: PlaybackHistory) {
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

export async function getPlaybackHistory() {
  return getDB().playbackHistory.reverse().toArray();
}
