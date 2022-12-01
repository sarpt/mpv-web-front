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

export type PlaybackSubscriptions = {
  mediaFileChange: AsyncGenerator<Playback, void, undefined>,
  pauseChange: AsyncGenerator<Playback, void, undefined>
}
