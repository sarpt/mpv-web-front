import type { Playback } from '../models/api';
import {
  errorHandler,
  eventSourceEventListener,
  EventSourceVariant,
  MoviesEvents,
  PlaybackEvents,
  StatusEvents,
} from '../models/sse';
import { ApiAddressState, apiAddressStore } from '../stores/api_address';
import { apiConnectionStore } from '../stores/api_connection';
import { MoviesMap, moviesStore } from '../stores/movies';
import { playbackStore } from '../stores/playback';

let address: string | undefined;
let eventSources: Map<EventSourceVariant, EventSource>;

export function init() {
  eventSources = new Map<EventSourceVariant, EventSource>();

  apiAddressStore.subscribe(handleApiAddressChange);
}

export function initStatusEventSource() {
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

  eventListeners.set(StatusEvents.Replay, messageHandler);
  eventListeners.set(StatusEvents.ClientObserverAdded, messageHandler);
  eventListeners.set(StatusEvents.ClientObserverRemoved, messageHandler);
  eventListeners.set(StatusEvents.MpvProcessChanged, messageHandler);

  const onError = (ev: Event) => {
    apiConnectionStore.set({
      connected: false,
    });
  };

  initEventSource(EventSourceVariant.Status, eventListeners, onError, true);
}

export function initPlaybackEventSource() {
  const eventListeners = new Map<string, eventSourceEventListener>();
  eventListeners.set(PlaybackEvents.All, (event: Event & { data?: string }) => {
    playbackStore.set({
      playback: JSON.parse(event.data || '') as Playback,
      error: false,
    });
  });

  const onError = (ev: Event) => {
    playbackStore.set({
      error: true,
    });
  };

  initEventSource(EventSourceVariant.Playback, eventListeners, onError, true);
}

export function initMoviesEventSource() {
  const eventListeners = new Map<string, eventSourceEventListener>();
  eventListeners.set(MoviesEvents.Added, (event: Event & { data?: string }) => {
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

  initEventSource(EventSourceVariant.Movies, eventListeners, onError, true);
}

export function initEventSource(
  eventSourceVariant: EventSourceVariant,
  eventListeners: Map<string, eventSourceEventListener>,
  onError: errorHandler,
  replayState: boolean,
) {
  let eventSource = eventSources.get(eventSourceVariant);
  if (!!eventSource) {
    eventSource.close();
  }

  const url = new URL(`http://${address}/sse/${eventSourceVariant}`);
  if (replayState) {
    url.searchParams.append('replay', 'true');
  }

  eventSource = new EventSource(url.toString());
  eventSources.set(eventSourceVariant, eventSource);

  eventListeners.forEach((eventListener, eventName) => {
    eventSource!.addEventListener(eventName, eventListener);
  });

  eventSource.onerror = createSseErrorHandler(eventSourceVariant, onError);
}

function handleApiAddressChange(apiAddressState: ApiAddressState) {
  address = apiAddressState.address;
  initStatusEventSource();
  initPlaybackEventSource();
  initMoviesEventSource();
}

function createSseErrorHandler(eventSourceVariant: EventSourceVariant, onError: errorHandler): errorHandler {
  return (ev: Event) => {
    const eventSource = eventSources.get(eventSourceVariant);
    if (!eventSource) return;

    onError(ev);
    eventSource!.close();
    eventSources.delete(eventSourceVariant);
  };
}
