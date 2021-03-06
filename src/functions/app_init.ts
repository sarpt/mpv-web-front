import { getMoviesSse, getPlaybackSse, getPlaylistSse, getStatusSse, init as initSse } from '../functions/sse';
import { moviesStore } from '../stores/movies';
import { playbackStore } from '../stores/playback';
import { apiConnectionStore } from '../stores/api_connection';

import { initPlaybackHistoryWatch } from './playback_history';
import { playlistsStore } from '../stores/playlists';

export function appInit() {
  initPlaybackHistoryWatch();

  getPlaybackSse().subscribe(
    playback => {
      playbackStore.set({
        playback,
      });
    },
  );

  getPlaylistSse().subscribe(
    playlists => {
      playlistsStore.set(playlists);
    },
  );

  getStatusSse().subscribe({
    next: () => {
      apiConnectionStore.update(state => {
        if (state.connected) {
          return state;
        }

        return {
          connected: true,
        };
      });
    },
    error: () => {
      apiConnectionStore.set({
        connected: false,
      });
    },
  });

  getMoviesSse().subscribe(
    movies => {
      moviesStore.update(state => {
        return {
          movies: {
            ...state.movies,
            ...movies,
          },
          isFetchingInProgress: false,
        };
      });
    },
  );

  initSse();
}
