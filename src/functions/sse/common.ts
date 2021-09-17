export enum SseChannelVariant {
  MediaFiles = 'mediaFiles',
  Playback = 'playback',
  Playlists = 'playlists',
  Status = 'status',
}

export type eventSourceEventListener = (event: Event & { data?: string }) => void;
export type errorHandler = (event: Event) => void;

export type sseChannel = {
  variant: SseChannelVariant,
  eventListeners: Map<string, eventSourceEventListener>,
  onError: errorHandler,
};
