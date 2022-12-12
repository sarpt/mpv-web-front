import { PlaybackRepository } from "../interfaces";

export type Output = void;

export interface PlayMediaFileUC {
  invoke(mediaFilePath: string): Promise<Output>,
}

export class PlayMediaFile implements PlayMediaFileUC {
  constructor(private playbackRepository: PlaybackRepository) {}

  async invoke(mediaFilePath: string): Promise<Output> {
    await this.playbackRepository.playMediaFile(mediaFilePath);
  }
}
