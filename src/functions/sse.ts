import type { Playback } from '../models/api';
import { playbackStore } from '../stores/playback';

let eventSource: EventSource | undefined;
const playbackAllEvent = 'all';

export function initializeEventSource(address: string) {
  if (!!eventSource) {
    eventSource.close();
  }

  eventSource = new EventSource(`http://${address}/sse/playback`);

  eventSource.addEventListener(playbackAllEvent, (event: Event & { data?: string }) => {
    playbackStore.set({
      playback: JSON.parse(event.data || '') as Playback,
      error: false,
    });
  });

  eventSource.onerror = (ev: Event) => {
    playbackStore.set({
      error: true,
    });
    eventSource!.close();
    eventSource = undefined;
  };
}
