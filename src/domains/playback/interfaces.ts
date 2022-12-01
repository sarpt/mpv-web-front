import { PlaybackSubscriptions } from "./entities";

export interface PlaybackRepository {
  subscribeToPlayback(): PlaybackSubscriptions,
  playMediaFile(path: string, append?: boolean): Promise<void>,
  setPause(paused: boolean): Promise<void>,
}
