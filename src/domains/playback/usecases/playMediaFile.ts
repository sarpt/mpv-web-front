import { PlaybackRepository, playMediaFileOpts } from "../interfaces";

export type Output = void;

export interface PlayMediaFileUC {
  invoke(mediaFilePath: string, opts?: playMediaFileOpts): Promise<Output>,
}

export class PlayMediaFile implements PlayMediaFileUC {
  constructor(private playbackRepository: PlaybackRepository) {}

  async invoke(mediaFilePath: string, opts?: playMediaFileOpts): Promise<Output> {
    await this.playbackRepository.playMediaFile(mediaFilePath, opts);
  }
}
