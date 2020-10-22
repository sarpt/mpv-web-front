export enum StatusEvents {
  Replay = 'replay',
  ClientObserverAdded = 'client-observer-added',
  ClientObserverRemoved = 'client-observer-removed',
  MpvProcessChanged = 'mpv-process-changed',
}

export enum PlaybackEvents {
  All = 'all',
}

export enum MoviesEvents {
  Added = 'added',
}

export enum EventSourceVariant {
  Playback = 'playback',
  Movies = 'movies',
  Status = 'status',
}

export type eventSourceEventListener = (event: Event & { data?: string }) => void;
export type errorHandler = (event: Event) => void;