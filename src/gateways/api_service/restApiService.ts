import { MediaFilesMap } from "../../domains/media_files/entities";
import { MediaFilesRepository } from "../../domains/media_files/interfaces";

const address = 'localhost:3001';

export class RestApiService implements MediaFilesRepository {
  async fetchMediaFiles(): Promise<MediaFilesMap> {
    try {
      const response = await fetch(`http://${address}/rest/media-files`);
      return (await response.json()).mediaFiles;
    } catch (err) {
      // TODO: add error handling idiot
      return {};
    }
  }
}