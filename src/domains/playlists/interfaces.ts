import { PlaylistsMap } from "./entities";

export interface PlaylistsRepository {
  fetchPlaylists(): Promise<PlaylistsMap>,
}
