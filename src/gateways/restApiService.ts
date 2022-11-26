import { MediaFilesMap } from "../domains/media_files/entities";
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

  subscribeToMediaFiles(): AsyncGenerator<MediaFilesMap, void, undefined> {
    const observer = new EventsObserver<MediaFilesMap>('mediaFiles.added');
    observer.setSource(this.eventSource);

    return observer.observe();
  }
}