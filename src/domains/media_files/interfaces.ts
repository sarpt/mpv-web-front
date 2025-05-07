import { Result } from "src/domains/common/either";
import { MediaFilesMap } from "./entities";

export interface MediaFilesRepository {
  fetchMediaFiles(): Promise<MediaFilesMap>,
  iterateMediaFiles(): Result<AsyncGenerator<Awaited<{ name: string, payload: MediaFilesMap }>, void, unknown>>;
}
