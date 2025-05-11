import { Result } from "src/domains/common/either";
import { MediaFilesMap } from "./entities";

export enum MediaFilesEvents {
  Added = 'added',
  Removed = 'removed',
  Replay = 'replay'
}

export interface MediaFilesRepository {
  iterateMediaFiles(): Result<AsyncGenerator<Awaited<{ eventVariant: MediaFilesEvents, payload: MediaFilesMap }>, void, unknown>>;
}
