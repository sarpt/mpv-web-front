import { Subject, Observable } from 'rxjs';

import type { MediaFilesMap } from '../../models/api';
import { sseChannel, eventSourceEventListener, SseChannelVariant } from './common';

export enum MediaFilesEvents {
  Added = 'added',
  Removed = 'removed',
}

export type MediaFilesAction = {
  event: MediaFilesEvents,
  items: MediaFilesMap,
};

const mediaFilesSse = new Subject<MediaFilesAction>();

export function getMediaFilesSse(): Observable<MediaFilesAction> {
  return mediaFilesSse.asObservable();
}

export function getMediaFilesSseChannel(): sseChannel {
  const eventListeners = new Map<string, eventSourceEventListener>();
  const getMessageHandler = (eventName: MediaFilesEvents) => {
    return (event: Event & { data?: string }) => {
      const action = {
        event: eventName,
        items: JSON.parse(event.data || '') as MediaFilesMap,
      };
      mediaFilesSse.next(action);
    };
  };

  const mediaFileEvents = [
    MediaFilesEvents.Added,
    MediaFilesEvents.Removed,
  ];
  mediaFileEvents.forEach(event => {
    const channelEvent = `${SseChannelVariant.MediaFiles}.${event}`;
    eventListeners.set(channelEvent, getMessageHandler(event));
  });

  const onError = (ev: Event) => {
    mediaFilesSse.error(ev);
  };

  return {
    variant: SseChannelVariant.MediaFiles,
    eventListeners,
    onError,
  };
}
