import { apiAddressStore } from '../stores/api_address';
import type { ApiAddressState } from '../stores/api_address';
import { moviesStore } from '../stores/movies';
import { playbackStore } from '../stores/playback';
import { apiConnectionStore } from '../stores/api_connection';

// TODO: move types to separate files
export type VideoStream = {
  Language: string,
  Width: number,
  Height: number,
};

export type AudioStream = {
  AudioID: string,
  Language: string,
  Channels: string,
  Title: string,
};

export type SubtitleStream = {
  SubtitleID: string,
  Language: string,
  Title: string,
};

export type Playback = {
  Movie: Movie,
  CurrentTime: number,
};

export type Chapter = {
  Title: string,
};

export type Movie = {
  Title: string,
  FormatName: string,
  FormatLongName: string,
  Path: string,
  Duration: number,
  VideoStreams: VideoStream[],
  AudioStreams: AudioStream[],
  SubtitleStreams: SubtitleStream[],
  Chapters: Chapter[],
};

let address: string | undefined;

let eventSource: EventSource | undefined;
const playbackEvent = 'playback';

function initializeEventSource() {
  if (!!eventSource) {
    eventSource.close();
  }

  eventSource = new EventSource(`http://${address}/sse/playback`);

  eventSource.addEventListener(playbackEvent, (event: Event & { data?: string }) => {
    playbackStore.set({
      playback: JSON.parse(event.data || '') as Playback,
      error: false,
    });
  });

  eventSource.onerror = (ev: Event) => {
    playbackStore.set({
      error: true,
    });
    eventSource!.close();
    eventSource = undefined;
  };
}

apiAddressStore.subscribe(handleApiAddressChange);

function handleApiAddressChange(apiAddressState: ApiAddressState) {
  address = apiAddressState.address;
  initializeEventSource();
}

export async function getMovies() {
  try {
    const res = await fetch(`http://${address}/movies`);
    const moviesResponse = await res.json();

    moviesStore.set({
      movies: moviesResponse.movies || [],
    });
  } catch(err) {
      apiConnectionStore.set({
        connected: false,
      });
  }
}

// TODO: change to store manipulation of api_connection
export async function isApiAvailable(newAddress: string): Promise<boolean> {
  try {
    await fetch(`http://${newAddress}/movies`, {
      method: 'HEAD',
    });

    return true;
  } catch (err) {
    return false;
  }
}

export type playMovieRequest = {
  path: string,
  fullscreen: boolean,
  audioId: string,
  subtitleId: string,
};

// TODO: change to store movie playback manipulation (error on playback?)
export async function playMovie(request: playMovieRequest): Promise<Response> {
  const formData = new FormData();
  formData.set('path', request.path || '');
  formData.set('fullscreen', `${request.fullscreen}`);
  formData.set('audioID', request.audioId);
  formData.set('subtitleID', request.subtitleId);

  return await fetch(`http://${address}/playback`, {
    method: 'POST',
    body: formData,
  });
}
