export enum StatusEvents {
  Replay = 'replay',
  ClientObserverAdded = 'client-observer-added',
  ClientObserverRemoved = 'client-observer-removed',
  MpvProcessChanged = 'mpv-process-changed',
}

export enum PlaybackEvents {
  FullscreenChange = 'fullscreenChange',
  LoopFileChange =  'loopFileChange',
  PauseChange =  'pauseChange',
  AudioIdChange =  'audioIdChange',
  SubtitleIdChange =  'subtitleIdChange',
  CurrentChapterIndexChange =  'currentChapterIndexChange',
  MovieChange =  'movieChange',
  PlaybackTimeChange =  'playbackTimeChange',
}

export enum MoviesEvents {
  Added = 'added',
}

export enum SseChannelVariant {
  Playback = 'playback',
  Movies = 'movies',
  Status = 'status',
}

export type eventSourceEventListener = (event: Event & { data?: string }) => void;
export type errorHandler = (event: Event) => void;
