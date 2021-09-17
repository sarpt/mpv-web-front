import { Subject, Observable } from 'rxjs';

import type { Playback } from '../../models/api';
import { sseChannel, eventSourceEventListener, SseChannelVariant } from './common';

const playbackSse = new Subject<Playback | undefined>();

export enum PlaybackEvents {
  AudioIdChange =  'audioIdChange',
  CurrentChapterIndexChange =  'currentChapterIndexChange',
  FullscreenChange = 'fullscreenChange',
  LoopFileChange =  'loopFileChange',
  MediaFileChange =  'mediaFileChange',
  PauseChange =  'pauseChange',
  PlaybackTimeChange =  'playbackTimeChange',
  PlaylistSelectionChange =  'playlistSelectionChange',
  PlaylistCurrentIdxChange =  'playlistCurrentIdxChange',
  SubtitleIdChange =  'subtitleIdChange',
}

export function getPlaybackSse(): Observable<Playback | undefined> {
  return playbackSse.asObservable();
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
    PlaybackEvents.MediaFileChange,
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
