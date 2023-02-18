import { PlaybackRepository } from "../interfaces";

export type Input = {
  subtitleId: string
};

export type Output = void;

export interface ChangeSubtitlesUC {
  invoke(input: Input): Promise<Output>,
}

export class ChangeSubtitles implements ChangeSubtitlesUC {
  constructor(private playbackRepository: PlaybackRepository) {}

  async invoke({ subtitleId }: Input): Promise<Output> {
    await this.playbackRepository.changeSubtitles(subtitleId);
  }
}
