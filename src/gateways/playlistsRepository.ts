import { Result } from "src/domains/common/either";
import { PlaylistEvents, PlaylistsMap } from "src/domains/playlists/entities";
import { PlaylistsRepository } from "src/domains/playlists/interfaces";
import { SSEApiService } from "src/gateways/sseApiService";

export class PlaylistsSeriveRepo implements PlaylistsRepository {
  constructor(
    private readonly sseApi: SSEApiService
  ) {}

  iteratePlaylists(): Result<AsyncGenerator<{ eventVariant: PlaylistEvents, payload: PlaylistsMap | undefined }, void, unknown>> {
    return this.sseApi.iteratePlaylists();
  }
}