import { Container, token, createResolve } from "@owja/ioc";

import { FetchMediaFiles, FetchMediaFilesUC } from '../../domains/media_files/usecases/fetchMediaFiles';
import { FetchPlayback, FetchPlaybackUC } from "../../domains/playback/usecases/fetchPlayback";
import { PlayMediaFile, PlayMediaFileUC } from "../../domains/playback/usecases/playMediaFile";
import { RestApiService } from '../../gateways/restApiService';

export const Dependencies = {
  "FetchMediaFilesUC": token<FetchMediaFilesUC>("FetchMediaFilesUC"),
  "FetchPlaybackUC": token<FetchPlaybackUC>("FetchPlaybackUC"),
  "PlayMediaFileUC": token<PlayMediaFileUC>("PlayMediaFileUC"),
}

export const container = new Container();
export const resolve = createResolve(container);

export function init() {
  const restApiService = new RestApiService();

  container.bind<PlayMediaFileUC>(Dependencies.PlayMediaFileUC).toFactory(() => new PlayMediaFile(restApiService));
  container.bind<FetchPlaybackUC>(Dependencies.FetchPlaybackUC).toFactory(() => new FetchPlayback(restApiService));
  container.bind<FetchMediaFilesUC>(Dependencies.FetchMediaFilesUC).toFactory(() => new FetchMediaFiles(restApiService));
}
