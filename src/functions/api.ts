import { apiAddress } from '../stores/api_address';

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

let eventSource: EventSource;
const playbackEvent = 'playback';

type sseSubscription = {
  playbackEventHandler: (playback: Playback) => void,
  errorHandler: (errEvent: Event) => void,
};

const sseSubscribers: sseSubscription[] = [];

export function subscribeToPlaybackChanges(subscription: sseSubscription) {
  sseSubscribers.push(subscription);
}

function initializeEventSource() {
  if (!!eventSource) {
    eventSource.close();
  }

  eventSource = new EventSource(`http://${address}/sse/playback`);

  eventSource.addEventListener(playbackEvent, (event: Event & { data?: string }) => {
    sseSubscribers.forEach(subscription => {
      subscription.playbackEventHandler(JSON.parse(event.data || '') as Playback);
    });
  });

  eventSource.onerror = (ev: Event) => {
    sseSubscribers.forEach(subscription => {
      subscription.errorHandler(ev);
    });
  };
}

apiAddress.subscribe(handleApiAddressChange);

function handleApiAddressChange(newAddress: { address: string }) {
  address = newAddress.address;
  initializeEventSource();
}

export async function getMovies(): Promise<Movie[]> {
  const res = await fetch(`http://${address}/movies`);
  const moviesResponse = await res.json();

  return moviesResponse.movies || [];
}

export type playMovieRequest = {
  path: string,
  fullscreen: boolean,
  audioId: string,
  subtitleId: string,
};

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
