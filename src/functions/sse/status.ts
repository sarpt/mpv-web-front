import { Subject, Observable } from 'rxjs';

import type { Status } from '../../models/api';
import { sseChannel, eventSourceEventListener, SseChannelVariant } from './common';

export enum StatusEvents {
  ClientObserverAdded = 'client-observer-added',
  ClientObserverRemoved = 'client-observer-removed',
  MpvProcessChanged = 'mpv-process-changed',
  Replay = 'replay',
}

const statusSse = new Subject<Status>();

export function getStatusSse(): Observable<Status> {
  return statusSse.asObservable();
}

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
