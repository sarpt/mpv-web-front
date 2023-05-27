import { MediaFilesMap } from "../domains/media_files/entities";
import { MediaFilesRepository } from "../domains/media_files/interfaces";
import { LoopVariant, Playback } from "../domains/playback/entities";
import { PlaybackRepository } from "../domains/playback/interfaces";
import { EventsObserver } from "./eventsObserver";

const address = 'localhost:3001';

enum PlaybackParameters {
  AudioId = 'audioID',
  Append = 'append',
  Path = 'path',
  Pause = 'pause',
  Fullscreen = 'fullscreen',
  LoopFile = 'loopFile',
  SubtitleId = 'subtitleID',
}

enum DomainNames {
  MediaFiles = 'MediaFiles',
  Playback = 'Playback',
}

const etagHeader = 'Etag';

type Domain<T = unknown> = {
  etag?: string | undefined,
  latestPayload?: T,
  path: string,
  responseJsonHandler: (json: any) => T,
}

type Domains = {
  [DomainNames.MediaFiles]: Domain<MediaFilesMap>,
  [DomainNames.Playback]: Domain<Playback>,
}

export class RestApiService implements MediaFilesRepository, PlaybackRepository {
  private eventObserver: EventsObserver;

  private domains: Domains  = {
    [DomainNames.MediaFiles]: {
      path: '/media-files',
      responseJsonHandler: (jsonPayload) => jsonPayload.mediaFiles,
    },
    [DomainNames.Playback]: {
      path: '/playback',
      responseJsonHandler: (jsonPayload) => jsonPayload,
    },
  };

  constructor() {
    const url = new URL(`http://${address}/sse/channels`);
    url.searchParams.append('channel', 'mediaFiles');
    url.searchParams.append('channel', 'playback');

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

  async fetchPlayback(): Promise<Playback | undefined> {
    try {
      return await this.fetchRestData(DomainNames.Playback) as Playback;
    } catch (err) {
      // TODO: add error handling idiot
      return;
    }
  }

  async playMediaFile(path: string, append?: boolean): Promise<void> {
    await this.postPlayback({
      [PlaybackParameters.Path]: path,
      [PlaybackParameters.Append]: append ?? false  
    });
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

    if (domain?.etag) headers.set(etagHeader, domain.etag);

    const response = await fetch(`http://${address}/rest${domain.path}`, { headers });
    if (response.status === 304) {
      return domain.latestPayload;
    }

    return domain.responseJsonHandler(await response.json());
  }
}
