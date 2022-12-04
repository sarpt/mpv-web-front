import { MediaFilesMap, MediaFilesSubscriptions } from "../domains/media_files/entities";
import { MediaFilesRepository } from "../domains/media_files/interfaces";
import { EventsObserver } from "./eventsObserver";

const address = 'localhost:3001';

export class RestApiService implements MediaFilesRepository {
  private eventObserver: EventsObserver;

  constructor() {
    const url = new URL(`http://${address}/sse/channels`);
    url.searchParams.append('channel', 'mediaFiles');

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

  subscribeToMediaFiles(): MediaFilesSubscriptions {
    return {
      added: this.eventObserver.observe<MediaFilesMap>('mediaFiles.added'),
      removed: this.eventObserver.observe<MediaFilesMap>('mediaFiles.removed'),
    };
  }
}