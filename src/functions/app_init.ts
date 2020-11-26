import { getMoviesSse, getPlaybackSse, getStatusSse, init as initSse } from '../functions/sse';
import { moviesStore } from '../stores/movies';
import { playbackStore } from '../stores/playback';
import { apiConnectionStore } from '../stores/api_connection';

export function appInit() {
  getPlaybackSse().subscribe(
    playback => {
      playbackStore.set({
        playback,
        error: false,
      });
    },
    () => {
      playbackStore.set({
        error: true,
      });
    },
  );

  getStatusSse().subscribe(
    () => {
      apiConnectionStore.update(state => {
        if (state.connected) {
          return state;
        }

        return {
          connected: true,
        };
      });
    },
    () => {
      apiConnectionStore.set({
        connected: false,
      });
    },
  );

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
    }, () => {
      moviesStore.set({
        movies: {},
        isFetchingInProgress: false,
      });
    },
  );

  initSse();
}
