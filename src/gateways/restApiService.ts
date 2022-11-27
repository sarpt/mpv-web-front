import { MediaFilesMap, MediaFilesSubscriptions } from "../domains/media_files/entities";
import { MediaFilesRepository } from "../domains/media_files/interfaces";
import { EventsObserver } from "./eventsObserver";

const address = 'localhost:3001';

export class RestApiService implements MediaFilesRepository {
  private eventSource: EventSource;

  constructor() {
    const url = new URL(`http://${address}/sse/channels`);
    url.searchParams.append('channel', 'mediaFiles');

    this.eventSource = new EventSource(url.toString());
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
    const addedObserver = new EventsObserver<MediaFilesMap>('mediaFiles.added');
    addedObserver.setSource(this.eventSource);

    const removedObserver = new EventsObserver<MediaFilesMap>('mediaFiles.removed');
    removedObserver.setSource(this.eventSource);

    return { added: addedObserver.observe(), removed: removedObserver.observe() };
  }
}