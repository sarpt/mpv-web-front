import { PlaybackRepository } from "../interfaces";

export type Output = void;

export interface FullscreenUC {
  invoke(enabled: boolean): Promise<Output>,
}

export class Fullscreen implements FullscreenUC {
  constructor(private playbackRepository: PlaybackRepository) {}

  async invoke(enabled: boolean): Promise<Output> {
    await this.playbackRepository.setFullscreen(enabled);
  }
}
