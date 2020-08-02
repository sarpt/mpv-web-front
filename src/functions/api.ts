type VideoStream = {
  Language: string,
  Width: number,
  Height: number,
};

type AudioStream = {
  Language: string,
  Channels: string,
};

type SubtitleStream = {
  Language: string,
};

export type Playback = {
  Movie: Movie,
  CurrentTime: string,
};

export type Movie = {
  Path: string,
  VideoStreams: VideoStream[],
  AudioStreams: AudioStream[],
  SubtitleStreams: SubtitleStream[],
};

let eventSource: EventSource;
const playbackEvent = "playback";
export function subscribeToPlaybackChanges(address: string, callback: (playback: Playback) => void) {
  if (!!eventSource) return;

  eventSource = new EventSource(`http://${address}/sse/playback`);

  eventSource.addEventListener(playbackEvent, (event: any) => {
    callback(JSON.parse(event.data) as Playback);
  })
}

export async function getMovies(address: string): Promise<Movie[]> {
  const res = await fetch(`http://${address}/movies`);
  const moviesResponse = await res.json();
  return moviesResponse.movies || [];
}

export async function playMovie(address:string, movie: Movie, fullscreen: boolean): Promise<Response> {
  const formData = new FormData();
  formData.set('path', movie.Path);
  formData.set('fullscreen', `${fullscreen}`);
  return await fetch(`http://${address}/playback`, {
    method: "POST",
    body: formData, 
  });
}

export const defaultAddress = 'localhost:3001';
