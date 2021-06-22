import { Observable, Subject } from 'rxjs';
import type { MoviesMap, Playback, Playlist, Playlists, Status } from '../models/api';
import {
  errorHandler,
  eventSourceEventListener,
  MoviesEvents,
  PlaybackEvents,
  PlaylistEvents,
  SseChannelVariant,
  StatusEvents,
} from '../models/sse';
import { ApiAddressState, apiAddressStore } from '../stores/api_address';

let eventSource: EventSource;
let address: string | undefined;

const playbackSse = new Subject<Playback | undefined>();
const playlistsSse = new Subject<Playlists>();
const moviesSse = new Subject<MoviesMap>();
const statusSse = new Subject<Status>();

export function getPlaybackSse(): Observable<Playback | undefined> {
  return playbackSse.asObservable();
}

export function getPlaylistSse(): Observable<Playlists> {
  return playlistsSse.asObservable();
}

export function getMoviesSse(): Observable<MoviesMap> {
  return moviesSse.asObservable();
}

export function getStatusSse(): Observable<Status> {
  return statusSse.asObservable();
}

export function init() {
  apiAddressStore.subscribe(handleApiAddressChange);
}

type sseChannel = {
  variant: SseChannelVariant,
  eventListeners: Map<string, eventSourceEventListener>,
  onError: errorHandler,
};

export function getStatusSseChannel(): sseChannel {
  const eventListeners = new Map<string, eventSourceEventListener>();
  const messageHandler = (event: Event & { data?: string }) => {
    statusSse.next(JSON.parse(event.data || '') as Status);
  };

  const statusEvents = [
    StatusEvents.Replay,
    StatusEvents.ClientObserverAdded,
    StatusEvents.ClientObserverRemoved,
    StatusEvents.MpvProcessChanged,
  ];
  statusEvents.forEach(event => {
    const channelEvent = `${SseChannelVariant.Status}.${event}`;
    eventListeners.set(channelEvent, messageHandler);
  });

  const onError = (ev: Event) => {
    statusSse.error(ev);
  };

  return {
    variant: SseChannelVariant.Status,
    eventListeners,
    onError,
  };
}

export function getPlaybackSseChannel(): sseChannel {
  const eventListeners = new Map<string, eventSourceEventListener>();
  const messageHandler = (event: Event & { data?: string }) => {
    const playbackPayload = event.data ? JSON.parse(event.data) as Playback : undefined;

    playbackSse.next(playbackPayload);
  };

  const playbackEvents = [
    PlaybackEvents.FullscreenChange,
    PlaybackEvents.LoopFileChange,
    PlaybackEvents.PauseChange,
    PlaybackEvents.AudioIdChange,
    PlaybackEvents.SubtitleIdChange,
    PlaybackEvents.CurrentChapterIndexChange,
    PlaybackEvents.MovieChange,
    PlaybackEvents.PlaybackTimeChange,
  ];
  playbackEvents.forEach(event => {
    const channelEvent = `${SseChannelVariant.Playback}.${event}`;
    eventListeners.set(channelEvent, messageHandler);
  });

  const onError = (ev: Event) => {
    playbackSse.error(ev);
  };

  return {
    variant: SseChannelVariant.Playback,
    eventListeners,
    onError,
  };
}

export function getPlaylistSseChannel(): sseChannel {
  const eventListeners = new Map<string, eventSourceEventListener>();
  const messageHandler = (event: Event & { data?: string }) => {
    if (!event.data) return;

    const playlistsPayload = JSON.parse(event.data) as Playlists;

    playlistsSse.next(playlistsPayload);
  };

  const playlistsEvents = [
    PlaylistEvents.ItemsChange,
    PlaylistEvents.Replay,
  ];
  playlistsEvents.forEach(event => {
    const channelEvent = `${SseChannelVariant.Playlists}.${event}`;
    eventListeners.set(channelEvent, messageHandler);
  });

  const onError = (ev: Event) => {
    playlistsSse.error(ev);
  };

  return {
    variant: SseChannelVariant.Playlists,
    eventListeners,
    onError,
  };
}

export function getMoviesSseChannel(): sseChannel {
  const eventListeners = new Map<string, eventSourceEventListener>();
  const messageHandler = (event: Event & { data?: string }) => {
    moviesSse.next(JSON.parse(event.data || '') as MoviesMap);
  };

  eventListeners.set(`${SseChannelVariant.Movies}.${MoviesEvents.Added}`, messageHandler);

  const onError = (ev: Event) => {
    moviesSse.error(ev);
  };

  return {
    variant: SseChannelVariant.Movies,
    eventListeners,
    onError,
  };
}

export function initEventSource(
  sseVariants: SseChannelVariant[],
  eventListeners: Map<string, eventSourceEventListener>,
  errorHandlers: errorHandler[],
  replayState: boolean,
) {
  if (!!eventSource) {
    eventSource.close();
  }

  const url = new URL(`http://${address}/sse/register`);
  sseVariants.forEach(variant => {
    url.searchParams.append('channel', variant);
  });
  if (replayState) {
    url.searchParams.append('replay', 'true');
  }

  eventSource = new EventSource(url.toString());

  eventListeners.forEach((eventListener, eventName) => {
    eventSource!.addEventListener(eventName, eventListener);
  });

  eventSource.onerror = createSseErrorHandler(errorHandlers);
}

function handleApiAddressChange(apiAddressState: ApiAddressState) {
  address = apiAddressState.address;

  startSseChannels();
}

function startSseChannels() {
  const sseChannels = [
    getMoviesSseChannel(),
    getPlaybackSseChannel(),
    getPlaylistSseChannel(),
    getStatusSseChannel(),
  ];
  const allEventListeners = new Map<string, eventSourceEventListener>();
  const allErrorHandlers: errorHandler[] = [];
  const allVariants: SseChannelVariant[] = [];

  sseChannels.forEach(channel => {
    allVariants.push(channel.variant);
    allErrorHandlers.push(channel.onError);
    channel.eventListeners.forEach((listener, eventName) => {
      allEventListeners.set(eventName, listener);
    });
  });
  initEventSource(allVariants, allEventListeners, allErrorHandlers, true);
}

function createSseErrorHandler(handlers: errorHandler[]): errorHandler {
  return (ev: Event) => {
    if (!eventSource) return;

    handlers.forEach(handler => handler(ev));
    eventSource!.close();
  };
}
