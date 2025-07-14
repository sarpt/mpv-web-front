import { makeErr, makeOk, Result } from "src/domains/common/either";
import { MpvWebApiService } from "src/domains/connection/interfaces";
import { MediaFilesMap } from "src/domains/media_files/entities";
import { MediaFilesEvents } from "src/domains/media_files/interfaces";
import { Playback } from "src/domains/playback/entities";
import { PlaybackEvents } from "src/domains/playback/interfaces";
import { PlaylistEvents, PlaylistsMap } from "src/domains/playlists/entities";
import { EventsObserver } from "src/gateways/eventsObserver";

export enum Domains {
  MediaFiles = 'mediaFiles',
  Playback = 'playback',
  Playlists = 'playlists'
}

const sseChannels = Object.values(Domains);

export class SSEApiService implements MpvWebApiService {
  private eventObserver?: EventsObserver;
  private mediaFilesIterator?: AsyncGenerator<{ eventVariant: MediaFilesEvents, payload: MediaFilesMap | undefined }, void, unknown>;
  private playbackIterator?: AsyncGenerator<{ eventVariant: PlaybackEvents, payload: Playback | undefined }, void, unknown>;
  private playlistsIterator?: AsyncGenerator<{ eventVariant: PlaylistEvents, payload: PlaylistsMap | undefined }, void, unknown>;

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
          return mapPayload<MediaFilesMap, MediaFilesEvents>(MediaFilesEvents.Added, payload);
        },
        [createChannelEvent(Domains.MediaFiles, MediaFilesEvents.Removed)]: (payload) => {
          return mapPayload<MediaFilesMap, MediaFilesEvents>(MediaFilesEvents.Removed, payload);
        },
        [createChannelEvent(Domains.MediaFiles, MediaFilesEvents.Replay)]: (payload) => {
          return mapPayload<MediaFilesMap, MediaFilesEvents>(MediaFilesEvents.Replay, payload);
        },
    });
    this.playbackIterator = this.eventObserver.aggregate({
      [createChannelEvent(Domains.Playback, PlaybackEvents.AudioIdChange)]: (payload) => {
        return mapPayload<Playback, PlaybackEvents>(PlaybackEvents.AudioIdChange, payload);
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.CurrentChapterIndexChange)]: (payload) => {
        return mapPayload<Playback, PlaybackEvents>(PlaybackEvents.CurrentChapterIndexChange, payload);
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.FullscreenChange)]: (payload) => {
        return mapPayload<Playback, PlaybackEvents>(PlaybackEvents.FullscreenChange, payload);
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.LoopFileChange)]: (payload) => {
        return mapPayload<Playback, PlaybackEvents>(PlaybackEvents.LoopFileChange, payload);
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.MediaFileChange)]: (payload) => {
        return mapPayload<Playback, PlaybackEvents>(PlaybackEvents.MediaFileChange, payload);
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.PauseChange)]: (payload) => {
        return mapPayload<Playback, PlaybackEvents>(PlaybackEvents.PauseChange, payload);
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.PlaybackTimeChange)]: (payload) => {
        return mapPayload<Playback, PlaybackEvents>(PlaybackEvents.PlaybackTimeChange, payload);
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.PlaylistCurrentIdxChange)]: (payload) => {
        return mapPayload<Playback, PlaybackEvents>(PlaybackEvents.PlaylistCurrentIdxChange, payload);
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.PlaylistSelectionChange)]: (payload) => {
        return mapPayload<Playback, PlaybackEvents>(PlaybackEvents.PlaylistSelectionChange, payload);
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.Replay)]: (payload) => {
        return mapPayload<Playback, PlaybackEvents>(PlaybackEvents.Replay, payload);
      },
      [createChannelEvent(Domains.Playback, PlaybackEvents.SubtitleIdChange)]: (payload) => {
        return mapPayload<Playback, PlaybackEvents>(PlaybackEvents.SubtitleIdChange, payload);
      },
    });
    this.playlistsIterator = this.eventObserver.aggregate({
      [createChannelEvent(Domains.Playlists, PlaylistEvents.Replay)]: (payload) => {
        return mapPayload<PlaylistsMap, PlaylistEvents>(PlaylistEvents.Replay, payload);
      },
      [createChannelEvent(Domains.Playlists, PlaylistEvents.Added)]: (payload) => {
        return mapPayload<PlaylistsMap, PlaylistEvents>(PlaylistEvents.Added, payload);
      },
      [createChannelEvent(Domains.Playlists, PlaylistEvents.ItemsChange)]: (payload) => {
        return mapPayload<PlaylistsMap, PlaylistEvents>(PlaylistEvents.ItemsChange, payload);
      },
    })
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

  iteratePlaylists() {
    const iterator = this.playlistsIterator;
    if (!iterator) return makeErr(new Error('connection to server SSE has not been estabilished'));

    return makeOk(iterator);
  }
}

type ChannelEvents = MediaFilesEvents | PlaybackEvents | PlaylistEvents;
export function createChannelEvent(domain: Domains, ev: ChannelEvents): string {
  return `${domain}.${ev}`;
}

function mapPayload<T, E>(ev: E, payload: string | undefined): { eventVariant: E, payload: T | undefined } {
  return {
    eventVariant: ev,
    payload: payload ? JSON.parse(payload) as T : undefined
  };
}
