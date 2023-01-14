import { PlaybackRepository } from "../interfaces";

export type Output = void;

export interface PauseUC {
  invoke(paused: boolean): Promise<Output>,
}

export class Pause implements PauseUC {
  constructor(private playbackRepository: PlaybackRepository) {}

  async invoke(paused: boolean): Promise<Output> {
    await this.playbackRepository.setPause(paused);
  }
}
