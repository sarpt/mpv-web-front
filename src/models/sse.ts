export enum StatusEvents {
  ClientObserverAdded = 'client-observer-added',
  ClientObserverRemoved = 'client-observer-removed',
  MpvProcessChanged = 'mpv-process-changed',
  Replay = 'replay',
}

export enum PlaybackEvents {
  AudioIdChange =  'audioIdChange',
  CurrentChapterIndexChange =  'currentChapterIndexChange',
  FullscreenChange = 'fullscreenChange',
  LoopFileChange =  'loopFileChange',
  MovieChange =  'movieChange',
  PauseChange =  'pauseChange',
  PlaybackTimeChange =  'playbackTimeChange',
  SubtitleIdChange =  'subtitleIdChange',
}

export enum PlaylistEvents {
  CurrentIdxChange = 'currentIdxChange',
  ItemsChange =  'playlistItemsChange',
  Replay =  'replay',
}

export enum MoviesEvents {
  Added = 'added',
}

export enum SseChannelVariant {
  Movies = 'movies',
  Playback = 'playback',
  Playlist = 'playlist',
  Status = 'status',
}

export type eventSourceEventListener = (event: Event & { data?: string }) => void;
export type errorHandler = (event: Event) => void;
