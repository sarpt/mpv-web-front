import { MediaFilesSubscriptions } from "../entities";
import { MediaFilesRepository } from "../interfaces";

export type Output = {
  subscriptions: MediaFilesSubscriptions,
};

export interface SubscribeToMediaFilesUC {
  invoke(): Promise<Output>,
}

export class SubscribeToMediaFiles implements SubscribeToMediaFilesUC {
  constructor(private mediaFilesRepository: MediaFilesRepository) {}
  async invoke(): Promise<Output> {
    return {
      subscriptions: await this.mediaFilesRepository.subscribeToMediaFiles()
    };
  }
}
