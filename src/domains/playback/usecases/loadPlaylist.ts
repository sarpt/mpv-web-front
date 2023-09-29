import { PlaybackRepository } from "../interfaces";

export type Output = void;

export interface LoadPlaylistUC {
  invoke(uuid: string, append?: boolean): Promise<Output>,
}

export class LoadPlaylist implements LoadPlaylistUC {
  constructor(private playbackRepository: PlaybackRepository) {}

  async invoke(uuid: string, append?: boolean): Promise<Output> {
    await this.playbackRepository.loadPlaylist(uuid, append);
  }
}
