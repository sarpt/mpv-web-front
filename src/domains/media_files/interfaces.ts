import { MediaFilesMap } from "./entities";

export interface MediaFilesRepository {
  fetchMediaFiles(): Promise<MediaFilesMap>,
  subscribeToMediaFiles(): AsyncGenerator<MediaFilesMap, void, undefined>,
}
