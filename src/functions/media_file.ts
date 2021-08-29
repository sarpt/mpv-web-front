import type { MediaFile } from '../models/api';

const defaultName = 'default';

type MediaFileDescription = Pick<MediaFile, 'Path' | 'Title'>;
export function getMediaFileName(mediaFile: MediaFileDescription): string {
  const title = mediaFile.Title;
  const pathParts = mediaFile.Path.split('/');
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
