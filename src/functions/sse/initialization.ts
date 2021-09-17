import { ApiAddressState, apiAddressStore } from '../../stores/api_address';
import type { SseChannelVariant, eventSourceEventListener, errorHandler } from './common';
import { getMediaFilesSseChannel } from './media_files';
import { getPlaybackSseChannel } from './playback';
import { getPlaylistSseChannel } from './playlists';
import { getStatusSseChannel } from './status';

let eventSource: EventSource;
let address: string | undefined;

// TODO: this needs to be reworked - changing eventSource on API address change should not be
// the only way to start SSE channels.
export function init() {
  apiAddressStore.subscribe(handleApiAddressChange);
}

function initEventSource(
  sseVariants: SseChannelVariant[],
  eventListeners: Map<string, eventSourceEventListener>,
  errorHandlers: errorHandler[],
  replayState: boolean,
) {
  if (!!eventSource) {
    eventSource.close();
  }

  const url = new URL(`http://${address}/sse/channels`);
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
    getMediaFilesSseChannel(),
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
