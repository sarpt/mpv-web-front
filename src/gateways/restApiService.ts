/* eslint-disable @typescript-eslint/no-unused-vars */
import { MediaFilesMap } from "../domains/media_files/entities";
import { MediaFilesRepository } from "../domains/media_files/interfaces";
import { LoopVariant, Playback } from "../domains/playback/entities";
import { PlaybackRepository, playMediaFileOpts } from "../domains/playback/interfaces";
import { PlaylistsMap } from "../domains/playlists/entities";
import { PlaylistsRepository } from "../domains/playlists/interfaces";
import { EventsObserver } from "./eventsObserver";

const address = 'localhost:3001';

enum PlaybackParameters {
  AudioId = 'audioID',
  Append = 'append',
  Path = 'path',
  Pause = 'pause',
  Fullscreen = 'fullscreen',
  LoopFile = 'loopFile',
  PlaylistUUID = 'playlistUUID',
  SubtitleId = 'subtitleID',
}

enum DomainNames {
  MediaFiles = 'MediaFiles',
  Playback = 'Playback',
  Playlists = 'Playlists',
}

const sseChannels = [
  'mediaFiles',
  'playback',
  'playlists'
];

const etagHeader = 'Etag';
const cacheControlHeader = 'Cache-Control';
const cacheControlForEtag = 'no-cache';

type Domain<T = unknown> =  {
  etag?: string | undefined | null,
  latestPayload?: T,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseJsonHandler: (json: any) => T,
}

type Domains = {
  [DomainNames.MediaFiles]: Domain<MediaFilesMap>,
  [DomainNames.Playback]: Domain<Playback>,
  [DomainNames.Playlists]: Domain<PlaylistsMap>
}

export class RestApiService implements MediaFilesRepository, PlaybackRepository, PlaylistsRepository {
  private eventObserver: EventsObserver;

  private domains: Domains = {
    [DomainNames.MediaFiles]: {
      path: '/media-files',
      responseJsonHandler: (jsonPayload) => jsonPayload.mediaFiles,
    },
    [DomainNames.Playback]: {
      path: '/playback',
      responseJsonHandler: (jsonPayload) => jsonPayload,
    },
    [DomainNames.Playlists]: {
      path: '/playlists',
      responseJsonHandler: (jsonPayload) => jsonPayload.playlists,
    }
  };

  constructor() {
    const url = new URL(`http://${address}/sse/channels`);
    sseChannels.forEach(channel => {
        url.searchParams.append('channel', channel);
    });

    this.eventObserver = new EventsObserver();

    const eventsSource = new EventSource(url.toString());
    this.eventObserver.setSource(eventsSource);
  }

  async changeAudio(audioId: string): Promise<void> {
    await this.postPlayback({
      [PlaybackParameters.AudioId]: audioId
    });
  }

  async changeSubtitles(subtitleId: string): Promise<void> {
    await this.postPlayback({
      [PlaybackParameters.SubtitleId]: subtitleId
    });
  }

  async fetchMediaFiles(): Promise<MediaFilesMap> {
    try {
      return await this.fetchRestData(DomainNames.MediaFiles) as MediaFilesMap;
    } catch (err) {
      // TODO: add error handling idiot
      return {};
    }
  }

  async fetchPlaylists(): Promise<PlaylistsMap> {
    try {
      return await this.fetchRestData(DomainNames.Playlists) as PlaylistsMap;
    } catch (err) {
      // TODO: add error handling idiot
      return {};
    }
  }

  async fetchPlayback(): Promise<Playback | undefined> {
    try {
      return await this.fetchRestData(DomainNames.Playback) as Playback;
    } catch (err) {
      // TODO: add error handling idiot
      return;
    }
  }

  async playMediaFile(path: string, opts?: playMediaFileOpts): Promise<void> {
    await this.postPlayback({
      [PlaybackParameters.Path]: path,
      [PlaybackParameters.Append]: opts?.append ?? false, 
      [PlaybackParameters.AudioId]: opts?.audioId,
      [PlaybackParameters.SubtitleId]: opts?.subtitleId,
      [PlaybackParameters.LoopFile]: opts?.loopVariant === LoopVariant.File
    });
  }

  async loadPlaylist(uuid: string, append?: boolean): Promise<void> {
    await this.postPlayback({
      [PlaybackParameters.PlaylistUUID]: uuid,
      [PlaybackParameters.Append]: append ?? false  
    })
  }

  async setPause(paused: boolean): Promise<void> {
    await this.postPlayback({
      [PlaybackParameters.Pause]: paused
    });
  }

  async setFullscreen(enabled: boolean): Promise<void> {
    await this.postPlayback({
      [PlaybackParameters.Fullscreen]: enabled
    });
  }

  async setLoopFile(variant: LoopVariant): Promise<void> {
    await this.postPlayback({
      [PlaybackParameters.LoopFile]: variant === LoopVariant.File
    });
  }

  private async postPlayback(params: Partial<Record<PlaybackParameters, unknown>>): Promise<void> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      formData.set(key, `${value}`);
    }

    try {
      await fetch(`http://${address}/rest/playback`, {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      // TODO: add error handling idiot
      return;
    }
  }

  private async fetchRestData(domainName: DomainNames) {
    const domain = this.domains[domainName];
    const headers = new Headers();
    if (!domain) throw new Error('domain has no handling information');

    if (domain?.etag) {
      headers.set(etagHeader, domain.etag);
      headers.set(cacheControlHeader, cacheControlForEtag);
    }

    const response = await fetch(`http://${address}/rest${domain.path}`, { headers });
    if (response.status === 304) {
      return domain.latestPayload;
    }

    const payload = domain.responseJsonHandler(await response.json());
    this.domains[domainName].etag = response.headers.get(etagHeader);
    this.domains[domainName].latestPayload = payload;
    return payload;
  }
}
