import { moviesStore } from '../stores/movies';
import { getMovies, headMovies, postPlayback } from './rest';

export async function checkApiAvailability(newAddress: string): Promise<boolean> {
  try {
    await headMovies(newAddress);

    return true;
  } catch (err) {
    return false;
  }
}

export type playMovieArguments = {
  path: string,
  pause: boolean,
  audioId?: string,
  subtitleId?: string,
  fullscreen: boolean,
};

export async function changeMovie(movie: playMovieArguments): Promise<boolean> {
  try {
    await postPlayback(movie);

    return true;
  } catch (err) {
    return false;
  }
}

export async function pause(paused: boolean): Promise<boolean> {
  try {
    await postPlayback({
      pause: paused,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function changeAudio(audioId: string | undefined): Promise<boolean> {
  try {
    await postPlayback({
      audioId,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function changeSubtitles(subtitleId: string | undefined): Promise<boolean> {
  try {
    await postPlayback({
      subtitleId,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function fullscreen(enabled: boolean): Promise<boolean> {
  try {
    await postPlayback({
      fullscreen: enabled,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchAllMovies() {
  try {
    moviesStore.set({
      movies: {},
      isFetchingInProgress: true,
    });

    const res = await getMovies();
    const moviesResponse = await res.json();

    moviesStore.set({
      movies: moviesResponse.movies || {},
      isFetchingInProgress: false,
    });
  } catch(err) {
    moviesStore.set({
      movies: {},
      isFetchingInProgress: false,
    });
  }
}
