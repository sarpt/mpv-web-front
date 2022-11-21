import { Dependencies, resolve } from "../di";
import { MediaFilesMap } from "../entities";

export type Output = {
  mediaFiles: MediaFilesMap,
};

export interface FetchMediaFilesUC {
  invoke(): Promise<Output>,
}

export class FetchMediaFiles implements FetchMediaFilesUC {
  async invoke(): Promise<Output> {
    const mediaFilesRepository = resolve(Dependencies.MediaFilesRepository);
    const mediaFiles = await mediaFilesRepository().fetchMediaFiles();

    return { mediaFiles };
  }
}
