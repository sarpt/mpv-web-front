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
  CurrentChapterIdx: number,
  Fullscreen: boolean,
  CurrentTime: number,
  SelectedAudioID: string,
  SelectedSubtitleID: string,
  Paused: boolean,
  Loop: Loop,
};

export enum LoopVariant {
  File = 'file',
  AB = 'ab',
}

export type Loop = {
  Variant: LoopVariant,
  ATime: number,
  BTime: number,
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
