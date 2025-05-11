import { makeErr, makeOk, Result } from "src/domains/common/either";
import { ApiService } from "src/domains/connection/interfaces";
import { MediaFilesMap } from "src/domains/media_files/entities";
import { MediaFilesEvents } from "src/domains/media_files/interfaces";
import { Playback } from "src/domains/playback/entities";
import { PlaybackEvents } from "src/domains/playback/interfaces";
import { EventsObserver } from "src/gateways/eventsObserver";

export enum Domains {
  MediaFiles = 'mediaFiles',
  Playback = 'playback',
  Playlists = 'playlists'
}

const sseChannels = Object.values(Domains);

export class SSEApiService implements ApiService {
  private eventObserver?: EventsObserver;
  private mediaFilesIterator?: AsyncGenerator<{ eventVariant: MediaFilesEvents, payload: MediaFilesMap }, void, unknown>;
  private playbackIterator?: AsyncGenerator<{ eventVariant: PlaybackEvents, payload: Playback }, void, unknown>;

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
        [createChannelEvent(Domains.MediaFiles, MediaFilesEvents.Added)]: (payload) => {
          return {
            eventVariant: MediaFilesEvents.Added,
            payload: JSON.parse(payload) as MediaFilesMap
          };
        },
        [createChannelEvent(Domains.MediaFiles, MediaFilesEvents.Removed)]: (payload) => {
          return {
            eventVariant: MediaFilesEvents.Removed,
            payload: JSON.parse(payload) as MediaFilesMap
          };
        },
        [createChannelEvent(Domains.MediaFiles, MediaFilesEvents.Replay)]: (payload) => {
          return {
            eventVariant: MediaFilesEvents.Replay,
            payload: JSON.parse(payload) as MediaFilesMap
          };
        },
    });
    this.playbackIterator = this.eventObserver.aggregate({
      [createChannelEvent(Domains.Playback, PlaybackEvents.AudioIdChange)]: (payload) => {
        return {
          eventVariant: PlaybackEvents.AudioIdChange,
          payload: JSON.parse(payload) as Playback 
        };
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.CurrentChapterIndexChange)]: (payload) => {
        return {
          eventVariant: PlaybackEvents.CurrentChapterIndexChange,
          payload: JSON.parse(payload) as Playback 
        };
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.FullscreenChange)]: (payload) => {
        return {
          eventVariant: PlaybackEvents.FullscreenChange,
          payload: JSON.parse(payload) as Playback 
        };
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.LoopFileChange)]: (payload) => {
        return {
          eventVariant: PlaybackEvents.LoopFileChange,
          payload: JSON.parse(payload) as Playback 
        };
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.MediaFileChange)]: (payload) => {
        return {
          eventVariant: PlaybackEvents.MediaFileChange,
          payload: JSON.parse(payload) as Playback 
        };
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.PauseChange)]: (payload) => {
        return {
          eventVariant: PlaybackEvents.PauseChange,
          payload: JSON.parse(payload) as Playback 
        };
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.PlaybackTimeChange)]: (payload) => {
        return {
          eventVariant: PlaybackEvents.PlaybackTimeChange,
          payload: JSON.parse(payload) as Playback 
        };
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.PlaylistCurrentIdxChange)]: (payload) => {
        return {
          eventVariant: PlaybackEvents.PlaylistCurrentIdxChange,
          payload: JSON.parse(payload) as Playback 
        };
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.PlaylistSelectionChange)]: (payload) => {
        return {
          eventVariant: PlaybackEvents.PlaylistSelectionChange,
          payload: JSON.parse(payload) as Playback 
        };
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.Replay)]: (payload) => {
        return {
          eventVariant: PlaybackEvents.Replay,
          payload: JSON.parse(payload) as Playback 
        };
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.SubtitleIdChange)]: (payload) => {
        return {
          eventVariant: PlaybackEvents.SubtitleIdChange,
          payload: JSON.parse(payload) as Playback 
        };
      },
    });
  }

  iterateMediaFiles() {
    const iterator = this.mediaFilesIterator;
    if (!iterator) return makeErr(new Error('connection to server SSE has not been estabilished'));

    return makeOk(iterator);
  }

  iteratePlayback() {
    const iterator = this.playbackIterator;
    if (!iterator) return makeErr(new Error('connection to server SSE has not been estabilished'));

    return makeOk(iterator);
  }
}

export function createChannelEvent(domain: Domains, ev: MediaFilesEvents | PlaybackEvents): string {
  return `${domain}.${ev}`;
}
