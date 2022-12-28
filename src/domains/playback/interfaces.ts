import { Playback } from "./entities";

export interface PlaybackRepository {
  fetchPlayback(): Promise<Playback | undefined>,
  playMediaFile(path: string, append?: boolean): Promise<void>,
  setPause(paused: boolean): Promise<void>,
}
