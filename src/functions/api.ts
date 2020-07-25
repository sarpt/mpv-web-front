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

type Movie = {
  Path: string,
  VideoStreams: VideoStream[],
  AudioStreams: AudioStream[],
  SubtitleStreams: SubtitleStream[],
};

// to be deleted, workaround for importing types bug
export function getInitialMovies(): Movie[] { return [] }

export async function getMovies(address: string): Promise<Movie[]> {
  const res = await fetch(`http://${address}/movies`);
  const moviesResponse = await res.json();
  return moviesResponse.movies || [];
}

export const defaultAddress = 'localhost:3001';
