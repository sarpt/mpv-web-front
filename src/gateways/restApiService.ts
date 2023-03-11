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

export class RestApiService implements MediaFilesRepository, PlaybackRepository {
  private eventObserver: EventsObserver;

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
      const response = await fetch(`http://${address}/rest/media-files`);
      return (await response.json()).mediaFiles;
    } catch (err) {
      // TODO: add error handling idiot
      return {};
    }
  }

  async fetchPlayback(): Promise<Playback | undefined> {
    try {
      const response = await fetch(`http://${address}/rest/playback`);
      return (await response.json());
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
}
