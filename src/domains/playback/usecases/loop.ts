import { LoopVariant } from "../../../delivery/ui/plocs/playback/models";
import { PlaybackRepository } from "../interfaces";

export type Output = void;

export interface LoopUC {
  invoke(variant: LoopVariant): Promise<Output>,
}

export class Loop implements LoopUC {
  constructor(private playbackRepository: PlaybackRepository) {}

  async invoke(variant: LoopVariant): Promise<Output> {
    await this.playbackRepository.setLoopFile(variant);
  }
}