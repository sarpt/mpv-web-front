import { MediaFilesMap, MediaFilesSubscriptions } from "./entities";

export interface MediaFilesRepository {
  fetchMediaFiles(): Promise<MediaFilesMap>,
  subscribeToMediaFiles(): MediaFilesSubscriptions,
}
