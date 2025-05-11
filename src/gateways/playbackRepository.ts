import { Result } from "src/domains/common/either";
import { Playback } from "src/domains/playback/entities";
import { PlaybackEvents, PlaybackRepository, playMediaFileOpts } from "src/domains/playback/interfaces";
import { RestApiService } from "src/gateways/restApiService";
import { SSEApiService } from "src/gateways/sseApiService";
import { LoopVariant } from "ui/plocs/playback/models";

export class PlaybackServicesRepo implements PlaybackRepository {
  constructor(
    private readonly restApi: RestApiService,
    private readonly sseApi: SSEApiService
  ) {}

  changeAudio(audioId: string): Promise<void> {
    return this.restApi.changeAudio(audioId);
  }

  changeSubtitles(subtitlesId: string): Promise<void> {
    return this.restApi.changeSubtitles(subtitlesId);
  }

  loadPlaylist(uuid: string, append?: boolean): Promise<void> {
    return this.restApi.loadPlaylist(uuid, append);
  }

  playMediaFile(path: string, opts?: playMediaFileOpts): Promise<void> {
    return this.restApi.playMediaFile(path, opts);
  }

  setPause(paused: boolean): Promise<void> {
    return this.restApi.setPause(paused);
  }

  setFullscreen(enabled: boolean): Promise<void> {
    return this.restApi.setFullscreen(enabled);
  }

  setLoopFile(variant: LoopVariant): Promise<void> {
    return this.restApi.setLoopFile(variant);
  }

  iteratePlayback(): Result<AsyncGenerator<Awaited<{ eventVariant: PlaybackEvents; payload: Playback; }>, void, unknown>> {
    return this.sseApi.iteratePlayback();
  }
}
