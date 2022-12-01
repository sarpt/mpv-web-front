import { PlaybackSubscriptions } from "../entities";
import { PlaybackRepository } from "../interfaces";

export type Output = {
  subscriptions: PlaybackSubscriptions,
};

export interface SubscribeToPlaybackUC {
  invoke(): Promise<Output>,
}

export class SubscribeToPlayback implements SubscribeToPlaybackUC {
  constructor(private playbackRepository: PlaybackRepository) {}
  async invoke(): Promise<Output> {
    return {
      subscriptions: await this.playbackRepository.subscribeToPlayback()
    };
  }
}
