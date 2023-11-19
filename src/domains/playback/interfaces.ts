import { LoopVariant } from "../../delivery/ui/plocs/playback/models";
import { Playback } from "./entities";

export type playMediaFileOpts = {
  audioId?: string;
  append?: boolean;
  subtitleId?: string;
  loopVariant?: LoopVariant;
}

export interface PlaybackRepository {
  changeAudio(audioId: string): Promise<void>,
  changeSubtitles(subtitlesId: string): Promise<void>,
  loadPlaylist(uuid: string, append?: boolean): Promise<void>,
  fetchPlayback(): Promise<Playback | undefined>,
  playMediaFile(path: string, opts?: playMediaFileOpts): Promise<void>,
  setPause(paused: boolean): Promise<void>,
  setFullscreen(enabled: boolean): Promise<void>,
  setLoopFile(variant: LoopVariant): Promise<void>,
}
