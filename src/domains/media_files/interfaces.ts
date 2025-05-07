import { Result } from "src/domains/common/either";
import { MediaFilesMap } from "./entities";

export enum MediaFilesEvents {
  Added,
  Removed,
}

export interface MediaFilesRepository {
  fetchMediaFiles(): Promise<MediaFilesMap>,
  iterateMediaFiles(): Result<AsyncGenerator<Awaited<{ eventVariant: MediaFilesEvents, payload: MediaFilesMap }>, void, unknown>>;
}
