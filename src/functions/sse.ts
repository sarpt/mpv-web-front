import type { Movie, Playback } from '../models/api';
import { ApiAddressState, apiAddressStore } from '../stores/api_address';
import { MoviesMap, moviesStore } from '../stores/movies';
import { playbackStore } from '../stores/playback';

const playbackAllEvent = 'all';
const moviesAddedEvent = 'added';

type eventSourceEventListener = (event: Event & { data?: string }) => void;
type errorHandler = (event: Event) => void;

enum EventSourceVariant {
  Playback = 'playback',
  Movies = 'movies',
}

let address: string | undefined;
let eventSources: Map<EventSourceVariant, EventSource>;

export function init() {
  eventSources = new Map<EventSourceVariant, EventSource>();

  apiAddressStore.subscribe(handleApiAddressChange);
}

function handleApiAddressChange(apiAddressState: ApiAddressState) {
  address = apiAddressState.address;
  initPlaybackEventSource();
  initMoviesEventSource();
}

export function initPlaybackEventSource() {
  const eventListeners = new Map<string, eventSourceEventListener>();
  eventListeners.set(playbackAllEvent, (event: Event & { data?: string }) => {
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
  eventListeners.set(moviesAddedEvent, (event: Event & { data?: string }) => {
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

function createSseErrorHandler(eventSourceVariant: EventSourceVariant, onError: errorHandler): errorHandler {
  return (ev: Event) => {
    const eventSource = eventSources.get(eventSourceVariant);
    if (!eventSource) return;

    onError(ev);
    eventSource!.close();
    eventSources.delete(eventSourceVariant);
  };
}
