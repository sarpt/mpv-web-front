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
  MediaFileChange =  'mediaFileChange',
  PauseChange =  'pauseChange',
  PlaybackTimeChange =  'playbackTimeChange',
  PlaylistSelectionChange =  'playlistSelectionChange',
  PlaylistCurrentIdxChange =  'playlistCurrentIdxChange',
  SubtitleIdChange =  'subtitleIdChange',
}

export enum PlaylistEvents {
  Added = 'added',
  ItemsChange = 'itemsChange',
  Replay =  'replay',
}

export enum MediaFilesEvents {
  Added = 'added',
}

export enum SseChannelVariant {
  MediaFiles = 'mediaFiles',
  Playback = 'playback',
  Playlists = 'playlists',
  Status = 'status',
}

export type eventSourceEventListener = (event: Event & { data?: string }) => void;
export type errorHandler = (event: Event) => void;
