import { MediaFilesMap } from "../../domains/media_files/entities";
import { MediaFilesRepository } from "../../domains/media_files/interfaces";

const address = 'localhost:3001';

class EventSourceObserver<T> {
  private waitPromise: Promise<T>;
  private resolve: ((mediaFiles: T) => void) | undefined;

  constructor(event: string, private eventSource: EventSource) {
    this.waitPromise = new Promise((resolve) => {
      this.resolve = resolve;
    });

    eventSource.addEventListener(event, (event: any) => {
      this.resolve && this.resolve(JSON.parse(event.data ?? '') as T);  
    });
  }

  async *observe() {
    while(true) {
      yield await this.waitPromise;
      this.waitPromise = new Promise<T>((resolve) => {
        this.resolve = resolve;
      });
    }
  }
}

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
    return new EventSourceObserver<MediaFilesMap>('mediaFiles.added', this.eventSource).observe();
  }
}