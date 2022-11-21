import { MediaFilesMap } from "../entities";
import { MediaFilesRepository } from "../interfaces";

export type Output = {
  mediaFiles: MediaFilesMap,
};

export interface FetchMediaFilesUC {
  invoke(): Promise<Output>,
}

export class FetchMediaFiles implements FetchMediaFilesUC {
  constructor(private mediaFilesRepository: MediaFilesRepository) {}
  async invoke(): Promise<Output> {
    const mediaFiles = await this.mediaFilesRepository.fetchMediaFiles();

    return { mediaFiles };
  }
}
