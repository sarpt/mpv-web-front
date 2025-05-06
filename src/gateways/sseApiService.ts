import { makeErr, makeOk, Result } from "src/domains/common/either";
import { ApiService } from "src/domains/connection/interfaces";
import { MediaFilesMap } from "src/domains/media_files/entities";
import { EventsObserver } from "src/gateways/eventsObserver";

const sseChannels = [
  'mediaFiles',
  'playback',
  'playlists'
];

export class SSEApiService implements ApiService {
  private eventObserver?: EventsObserver;

  async connect(address: string): Promise<Result<undefined>> {
    try {
      await fetch(`http://${address}/rest/playback`, {
        method: 'HEAD',
      });
      this.initSse(address);
      return makeOk(undefined);
    } catch (err) {
      return makeErr(new Error(`${err}`));
    }
  }

  private initSse(address: string) {
    this.eventObserver?.close();

    const url = new URL(`http://${address}/sse/channels`);
    sseChannels.forEach(channel => {
        url.searchParams.append('channel', channel);
    });

    this.eventObserver = new EventsObserver();

    const eventsSource = new EventSource(url.toString());
    this.eventObserver.setSource(eventsSource);
  }

  iterateAddedMediaFiles(): Result<AsyncGenerator<Awaited<MediaFilesMap>, void, unknown>> {
    if (!this.eventObserver) return makeErr(new Error('connection to server SSE has not been estabilished'));

    return makeOk(this.eventObserver.observe<MediaFilesMap>('mediaFiles.added'));
  }  

  iterateRemovedMediaFiles(): Result<AsyncGenerator<Awaited<MediaFilesMap>, void, unknown>> {
    if (!this.eventObserver) return makeErr(new Error('connection to server SSE has not been estabilished'));

    return makeOk(this.eventObserver.observe<MediaFilesMap>('mediaFiles.removed'));
  }  
}
