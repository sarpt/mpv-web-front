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
  MediaFilePath: string,
  CurrentChapterIdx: number,
  Fullscreen: boolean,
  CurrentTime: number,
  SelectedAudioID: string,
  SelectedSubtitleID: string,
  PlaylistUUID: string,
  PlaylistCurrentIdx: number,
  Paused: boolean,
  Loop: Loop,
};

export type PlaylistEntry = {
  Path: string,
  PlaybackTimestamp: number,
  AudioId: string,
  SubtitleId: string
};

export type Playlist = {
  Entries: PlaylistEntry[],
  Name: string,
  CurrentEntryIdx: number,
  Description: string,
};

export type Playlists = {
  Items: Record<string, Playlist>,
};

export enum LoopVariant {
  File = 'file',
  Playlist = 'playlist',
  AB = 'ab',
  Off = 'off',
}

export type Loop = {
  Variant: LoopVariant,
  ATime: number,
  BTime: number,
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

export type MediaFilesSubscriptions = {
  added: AsyncGenerator<MediaFilesMap, void, undefined>,
  removed: AsyncGenerator<MediaFilesMap, void, undefined>
}
