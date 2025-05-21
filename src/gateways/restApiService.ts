import { ApiService } from "src/domains/connection/interfaces";
import { MediaFilesMap } from "../domains/media_files/entities";
import { LoopVariant, Playback } from "../domains/playback/entities";
import { playMediaFileOpts } from "../domains/playback/interfaces";
import { PlaylistsMap } from "../domains/playlists/entities";
import { makeErr, makeOk, Result } from "src/domains/common/either";

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

export class RestApiService implements ApiService {
  private address?: string;

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

  async connect(address: string): Promise<Result<undefined>> {
    try {
      await fetch(`http://${address}/rest/playback`, {
        method: 'HEAD',
      });
      this.address = address;
      return makeOk(undefined);
    } catch (err) {
      return makeErr(new Error(`${err}`));
    }
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

  private async postPlayback(params: Partial<Record<PlaybackParameters, unknown>>): Promise<Result<void>> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      formData.set(key, `${value}`);
    }

    try {
      const result = await fetch(`http://${this.address}/rest/playback`, {
        method: 'POST',
        body: formData,
      });

      if (result.status === 200) return makeOk(undefined as void);
    
      return makeErr(new Error(`code: ${result.status}; ${await result.text()}`));
    } catch (err) {
      return makeErr(new Error(`fetch resulted in an error: ${err}`));
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

    const response = await fetch(`http://${this.address}/rest${domain.path}`, { headers });
    if (response.status === 304) {
      return domain.latestPayload;
    }

    const payload = domain.responseJsonHandler(await response.json());
    this.domains[domainName].etag = response.headers.get(etagHeader);
    this.domains[domainName].latestPayload = payload;
    return payload;
  }
}
