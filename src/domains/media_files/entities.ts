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

export type Chapter = {
  Title: string,
};

export type MediaFile = {
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

export type MediaFilesMap = { [key in string]: MediaFile };
