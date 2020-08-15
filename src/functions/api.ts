export type VideoStream = {
  Language: string,
  Width: number,
  Height: number,
};

export type AudioStream = {
  AudioID: string,
  Language: string,
  Channels: string,
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

export type Movie = {
  Path: string,
  Duration: number,
  VideoStreams: VideoStream[],
  AudioStreams: AudioStream[],
  SubtitleStreams: SubtitleStream[],
};

let eventSource: EventSource;
const playbackEvent = 'playback';
export function subscribeToPlaybackChanges(address: string, callback: (playback: Playback) => void) {
  if (!!eventSource) return;

  eventSource = new EventSource(`http://${address}/sse/playback`);

  eventSource.addEventListener(playbackEvent, (event: Event & { data?: string }) => {
    callback(JSON.parse(event.data || '') as Playback);
  });
}

export async function getMovies(address: string): Promise<Movie[]> {
  const res = await fetch(`http://${address}/movies`);
  const moviesResponse = await res.json();

  return moviesResponse.movies || [];
}

export type playMovieRequest = {
  address: string,
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

  return await fetch(`http://${request.address}/playback`, {
    method: 'POST',
    body: formData,
  });
}

export const defaultAddress = 'localhost:3001';
