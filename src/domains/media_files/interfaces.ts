import { Result } from "src/domains/common/either";
import { MediaFilesMap } from "./entities";

export interface MediaFilesRepository {
  fetchMediaFiles(): Promise<MediaFilesMap>,
  iterateAddedMediaFiles(): Result<AsyncGenerator<Awaited<MediaFilesMap>, void, unknown>>,
  iterateRemovedMediaFiles(): Result<AsyncGenerator<Awaited<MediaFilesMap>, void, unknown>>,
}
