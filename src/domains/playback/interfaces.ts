import { Result } from "src/domains/common/either";
import { LoopVariant } from "../../delivery/ui/plocs/playback/models";
import { Playback } from "./entities";

export enum PlaybackEvents {
  AudioIdChange =  'audioIdChange',
  CurrentChapterIndexChange =  'currentChapterIndexChange',
  FullscreenChange = 'fullscreenChange',
  LoopFileChange =  'loopFileChange',
  MediaFileChange =  'mediaFileChange',
  PauseChange =  'pauseChange',
  PlaybackTimeChange =  'playbackTimeChange',
  PlaylistSelectionChange =  'playlistSelectionChange',
  PlaylistCurrentIdxChange =  'playlistCurrentIdxChange',
  SubtitleIdChange =  'subtitleIdChange',
  Replay = 'replay'
}

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
  playMediaFile(path: string, opts?: playMediaFileOpts): Promise<void>,
  setPause(paused: boolean): Promise<void>,
  setFullscreen(enabled: boolean): Promise<void>,
  setLoopFile(variant: LoopVariant): Promise<void>,
  iteratePlayback(): Result<AsyncGenerator<Awaited<{ eventVariant: PlaybackEvents, payload: Playback | undefined }>, void, unknown>>;
}
