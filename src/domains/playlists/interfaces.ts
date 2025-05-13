import { Result } from "src/domains/common/either";
import { PlaylistEvents, PlaylistsMap } from "./entities";

export interface PlaylistsRepository {
  iteratePlaylists(): Result<AsyncGenerator<{ eventVariant: PlaylistEvents, payload: PlaylistsMap | undefined }, void, unknown>>;
}
