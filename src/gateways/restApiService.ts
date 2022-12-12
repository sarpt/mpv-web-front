import { MediaFilesMap, MediaFilesSubscriptions } from "../domains/media_files/entities";
import { MediaFilesRepository } from "../domains/media_files/interfaces";
import { Playback, PlaybackSubscriptions } from "../domains/playback/entities";
import { PlaybackRepository } from "../domains/playback/interfaces";
import { EventsObserver } from "./eventsObserver";

const address = 'localhost:3001';

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
      return (await response.json()).playback;
    } catch (err) {
      // TODO: add error handling idiot
      return;
    }
  }

  async playMediaFile(path: string, append?: boolean): Promise<void> {
    const formData = new FormData();
    formData.set('path', path);

    if (append) {
      formData.set('append', `${append}`);
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

  async setPause(paused: boolean): Promise<void> {
    const formData = new FormData();
    formData.set('pause', `${paused}`);

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

  subscribeToMediaFiles(): MediaFilesSubscriptions {
    return {
      added: this.eventObserver.observe<MediaFilesMap>('mediaFiles.added'),
      removed: this.eventObserver.observe<MediaFilesMap>('mediaFiles.removed'),
    };
  }

  subscribeToPlayback(): PlaybackSubscriptions {
    return {
      mediaFileChange: this.eventObserver.observe<Playback>('playback.mediaFileChange'),
      pauseChange: this.eventObserver.observe<Playback>('playback.pauseChange'),
      changeTime: this.eventObserver.observe<Playback>('playback.playbackTimeChange'),
    };
  }
}