import { MediaFilesMap } from "../../media_files/entities";
import { MediaFilesRepository } from "../../media_files/gateways/interfaces";

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