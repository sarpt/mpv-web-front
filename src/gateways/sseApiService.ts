import { makeErr, makeOk, Result } from "src/domains/common/either";
import { ApiService } from "src/domains/connection/interfaces";
import { MediaFilesMap } from "src/domains/media_files/entities";
import { MediaFilesEvents } from "src/domains/media_files/interfaces";
import { EventsObserver } from "src/gateways/eventsObserver";

export enum Domains {
  MediaFiles = 'mediaFiles',
  Playback = 'playback',
  Playlists = 'playlists'
}

export enum MediaFilesChannelEvents {
  Added = 'added',
  Removed = 'removed',
  Replay = 'replay'
}

const sseChannels = Object.values(Domains);

export class SSEApiService implements ApiService {
  private eventObserver?: EventsObserver;
  private mediaFilesIterator?: AsyncGenerator<{ eventVariant: MediaFilesEvents, payload: MediaFilesMap }, void, unknown>;

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
    url.searchParams.append('replay', 'true');

    this.eventObserver = new EventsObserver();

    const eventsSource = new EventSource(url.toString());
    this.eventObserver.setSource(eventsSource);

    // start iterating over event observer at the init
    // without this the first call to "next" on generator from event observer might be too late and events can be missed
    this.mediaFilesIterator = this.eventObserver.aggregate({
        [createChannelEvent(Domains.MediaFiles, MediaFilesChannelEvents.Added)]: (payload) => {
          return {
            eventVariant: MediaFilesEvents.Added,
            payload: JSON.parse(payload) as MediaFilesMap
          };
        },
        [createChannelEvent(Domains.MediaFiles, MediaFilesChannelEvents.Removed)]: (payload) => {
          return {
            eventVariant: MediaFilesEvents.Removed,
            payload: JSON.parse(payload) as MediaFilesMap
          };
        },
        [createChannelEvent(Domains.MediaFiles, MediaFilesChannelEvents.Replay)]: (payload) => {
          return {
            eventVariant: MediaFilesEvents.Added,
            payload: JSON.parse(payload) as MediaFilesMap
          };
        },
    });
  }

  iterateMediaFiles() {
    if (!this.mediaFilesIterator) return makeErr(new Error('connection to server SSE has not been estabilished'));

    return makeOk(this.mediaFilesIterator);
  }
}

export function createChannelEvent(domain: Domains, ev: MediaFilesChannelEvents): string {
  return `${domain}.${ev}`;
}
