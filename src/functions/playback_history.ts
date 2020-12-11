import { distinctUntilChanged } from 'rxjs/operators';

import type { Playback } from '../models/api';
import { getDB } from './db';

import { getPlaybackSse } from './sse';

export function initPlaybackHistoryWatch() {
  getPlaybackSse()
    .pipe(
      distinctUntilChanged(shouldOmitPlaybackChange),
    )
    .subscribe(addPlaybackToHistory);
}

function shouldOmitPlaybackChange(prevPlayback: Playback, newPlayback: Playback): boolean {
  const playbackEntriesEqual = prevPlayback.Movie.Path === newPlayback.Movie.Path
    && prevPlayback.SelectedAudioID === newPlayback.SelectedAudioID
    && prevPlayback.SelectedSubtitleID === newPlayback.SelectedSubtitleID

  return !newPlayback.Movie.Path || playbackEntriesEqual;
}

function addPlaybackToHistory(playback: Playback) {
  getDB()
    .playbackHistory
    .put({
      Path: playback.Movie.Path,
      Title: playback.Movie.Title,
      AudioID: playback.SelectedAudioID,
      SubtitleID: playback.SelectedSubtitleID,
    });
}

export async function getPlaybackHistory() {
  return getDB().playbackHistory.reverse().toArray();
}
