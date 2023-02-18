import { PlaybackRepository } from "../interfaces";

export type Input = {
  audioId: string
};

export type Output = void;

export interface ChangeAudioUC {
  invoke(input: Input): Promise<Output>,
}

export class ChangeAudio implements ChangeAudioUC {
  constructor(private playbackRepository: PlaybackRepository) {}

  async invoke({ audioId }: Input): Promise<Output> {
    await this.playbackRepository.changeAudio(audioId);
  }
}
