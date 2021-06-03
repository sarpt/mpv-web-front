import { distinctUntilChanged, withLatestFrom } from 'rxjs/operators';

import type { MoviesMap, Playback } from '../models/api';
import { getDB } from './db';

import { getPlaybackSse, getMoviesSse } from './sse';

export function initPlaybackHistoryWatch() {
  getPlaybackSse()
    .pipe(
      distinctUntilChanged(shouldOmitPlaybackChange),
      withLatestFrom(getMoviesSse())
    )
    .subscribe(addPlaybackToHistory);
}

function shouldOmitPlaybackChange(prevPlayback: Playback, newPlayback: Playback): boolean {
  const playbackEntriesEqual = prevPlayback.MoviePath === newPlayback.MoviePath
    && prevPlayback.SelectedAudioID === newPlayback.SelectedAudioID
    && prevPlayback.SelectedSubtitleID === newPlayback.SelectedSubtitleID;

  return !newPlayback.MoviePath || playbackEntriesEqual;
}

function addPlaybackToHistory([playback, movies]: [playback: Playback, movies: MoviesMap]) {
  const movie = movies[playback.MoviePath];

  getDB()
    .playbackHistory
    .put({
      Path: movie.Path,
      Title: movie.Title,
      AudioID: playback.SelectedAudioID,
      SubtitleID: playback.SelectedSubtitleID,
    });
}

export async function getPlaybackHistory() {
  return getDB().playbackHistory.reverse().toArray();
}
