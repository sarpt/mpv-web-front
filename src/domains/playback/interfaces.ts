import { Playback, PlaybackSubscriptions } from "./entities";

export interface PlaybackRepository {
  fetchPlayback(): Promise<Playback | undefined>,
  subscribeToPlayback(): PlaybackSubscriptions,
  playMediaFile(path: string, append?: boolean): Promise<void>,
  setPause(paused: boolean): Promise<void>,
}
