import { PlaylistsMap } from "../entities";
import { PlaylistsRepository } from "../interfaces";

export type Output = {
  playlists: PlaylistsMap,
};

export interface FetchPlaylistsUC {
  invoke(): Promise<Output>,
}

export class FetchPlaylists implements FetchPlaylistsUC {
  constructor(private playlistsRepository: PlaylistsRepository) {}
  async invoke(): Promise<Output> {
    const playlists = await this.playlistsRepository.fetchPlaylists();

    return { playlists };
  }
}
