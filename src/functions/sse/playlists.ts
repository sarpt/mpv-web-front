import { Subject, Observable } from 'rxjs';

import type { Playlists } from '../../models/api';
import { sseChannel, eventSourceEventListener, SseChannelVariant } from './common';

export enum PlaylistEvents {
  Added = 'added',
  ItemsChange = 'itemsChange',
  Replay =  'replay',
}

const playlistsSse = new Subject<Playlists>();

export function getPlaylistSse(): Observable<Playlists> {
  return playlistsSse.asObservable();
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
