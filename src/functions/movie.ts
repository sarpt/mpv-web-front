import type { Movie } from './api';

const defaultName = 'default';

export function getMovieName(movie: Movie): string {
  const title = movie.Title;
  const pathParts = movie.Path.split('/');
  const filename = pathParts[pathParts.length - 1];

  return title !== '' ? `${filename} (${title})` : filename;
}

interface Stream {
  Title: string;
  Language: string;
}
export function getStreamName(stream: Stream): string {
  const title = stream.Title;
  const language = stream.Language || defaultName;

  return title !== '' ? `${language} (${title})` : language;
}
