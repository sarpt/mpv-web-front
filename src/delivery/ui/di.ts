import { Container, token, createResolve } from "@owja/ioc";

import { FetchMediaFiles, FetchMediaFilesUC } from '../../domains/media_files/usecases/fetchMediaFiles';
import { ChangeAudio, ChangeAudioUC } from "../../domains/playback/usecases/changeAudio";
import { ChangeSubtitles, ChangeSubtitlesUC } from "../../domains/playback/usecases/changeSubtitles";
import { FetchPlayback, FetchPlaybackUC } from "../../domains/playback/usecases/fetchPlayback";
import { Fullscreen, FullscreenUC } from "../../domains/playback/usecases/fullscreen";
import { Loop, LoopUC } from "../../domains/playback/usecases/loop";
import { Pause, PauseUC } from "../../domains/playback/usecases/pause";
import { PlayMediaFile, PlayMediaFileUC } from "../../domains/playback/usecases/playMediaFile";
import { RestApiService } from '../../gateways/restApiService';

export const Dependencies = {
  "ChangeAudioUC": token<ChangeAudioUC>("ChangeAudioUC"),
  "ChangeSubtitlesUC": token<ChangeSubtitlesUC>("ChangeSubtitlesUC"),
  "FetchMediaFilesUC": token<FetchMediaFilesUC>("FetchMediaFilesUC"),
  "FetchPlaybackUC": token<FetchPlaybackUC>("FetchPlaybackUC"),
  "FullscreenUC": token<FullscreenUC>("FullscreenUC"),
  "LoopUC": token<LoopUC>("LoopUC"),
  "PlayMediaFileUC": token<PlayMediaFileUC>("PlayMediaFileUC"),
  "PauseUC": token<PauseUC>("PauseUC"),
}

export const container = new Container();
export const resolve = createResolve(container);

export function init() {
  const restApiService = new RestApiService();

  container.bind<ChangeAudioUC>(Dependencies.ChangeAudioUC).toFactory(() => new ChangeAudio(restApiService));
  container.bind<ChangeSubtitlesUC>(Dependencies.ChangeSubtitlesUC).toFactory(() => new ChangeSubtitles(restApiService));
  container.bind<FetchMediaFilesUC>(Dependencies.FetchMediaFilesUC).toFactory(() => new FetchMediaFiles(restApiService));
  container.bind<FetchPlaybackUC>(Dependencies.FetchPlaybackUC).toFactory(() => new FetchPlayback(restApiService));
  container.bind<FullscreenUC>(Dependencies.FullscreenUC).toFactory(() => new Fullscreen(restApiService));
  container.bind<LoopUC>(Dependencies.LoopUC).toFactory(() => new Loop(restApiService));
  container.bind<PauseUC>(Dependencies.PauseUC).toFactory(() => new Pause(restApiService));
  container.bind<PlayMediaFileUC>(Dependencies.PlayMediaFileUC).toFactory(() => new PlayMediaFile(restApiService));
}
