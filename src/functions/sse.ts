import type { Playback } from '../models/api';
import {
  errorHandler,
  eventSourceEventListener,
  MoviesEvents,
  PlaybackEvents,
  SseChannelVariant,
  StatusEvents,
} from '../models/sse';
import { ApiAddressState, apiAddressStore } from '../stores/api_address';
import { apiConnectionStore } from '../stores/api_connection';
import { MoviesMap, moviesStore } from '../stores/movies';
import { playbackStore } from '../stores/playback';

let eventSource: EventSource;
let address: string | undefined;

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
    apiConnectionStore.update(state => {
      if (state.connected) {
        return state;
      }

      return {
        connected: true,
      };
    });
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
    apiConnectionStore.set({
      connected: false,
    });
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
    playbackStore.set({
      playback: JSON.parse(event.data || '') as Playback,
      error: false,
    });
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
    playbackStore.set({
      error: true,
    });
  };

  return {
    variant: SseChannelVariant.Playback,
    eventListeners,
    onError,
  };
}

export function getMoviesSseChannel(): sseChannel {
  const eventListeners = new Map<string, eventSourceEventListener>();
  eventListeners.set(`${SseChannelVariant.Movies}.${MoviesEvents.Added}`, (event: Event & { data?: string }) => {
    moviesStore.update((state) => {
      return {
        movies: {
          ...state.movies,
          ...JSON.parse(event.data || '') as MoviesMap,
        },
        isFetchingInProgress: false,
      };
    });
  });

  const onError = (ev: Event) => {
    moviesStore.set({
      movies: {},
      isFetchingInProgress: false,
    });
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

  const url = new URL(`http://${address}/sse`);
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
    getStatusSseChannel(),
    getPlaybackSseChannel(),
    getMoviesSseChannel(),
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
