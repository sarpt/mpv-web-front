import { Playback } from "../entities";
import { PlaybackRepository } from "../interfaces";

export type Output = {
  playback: Playback | undefined,
};

export interface FetchPlaybackUC {
  invoke(): Promise<Output>,
}

export class FetchPlayback implements FetchPlaybackUC {
  constructor(private playbackRepository: PlaybackRepository) {}

  async invoke(): Promise<Output> {
    const playback = await this.playbackRepository.fetchPlayback();

    return { playback };
  }
}
