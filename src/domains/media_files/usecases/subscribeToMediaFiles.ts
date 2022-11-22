import { MediaFilesMap } from "../entities";
import { MediaFilesRepository } from "../interfaces";

export type Output = {
  subscription: AsyncGenerator<MediaFilesMap, void, undefined>,
};

export interface SubscribeToMediaFilesUC {
  invoke(): Promise<Output>,
}

export class SubscribeToMediaFiles implements SubscribeToMediaFilesUC {
  constructor(private mediaFilesRepository: MediaFilesRepository) {}
  async invoke(): Promise<Output> {
    const subscription = await this.mediaFilesRepository.subscribeToMediaFiles();

    return { subscription };
  }
}
