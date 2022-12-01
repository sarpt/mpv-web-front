import { Container, token, createResolve } from "@owja/ioc";

import { FetchMediaFiles, FetchMediaFilesUC } from '../../domains/media_files/usecases/fetchMediaFiles';
import { SubscribeToMediaFiles, SubscribeToMediaFilesUC } from "../../domains/media_files/usecases/subscribeToMediaFiles";
import { SubscribeToPlayback, SubscribeToPlaybackUC } from "../../domains/playback/usecases/subscribeToPlayback";
import { RestApiService } from '../../gateways/restApiService';

export const Dependencies = {
  "FetchMediaFilesUC": token<FetchMediaFilesUC>("FetchMediaFilesUC"),
  "SubscribeToMediaFilesUC": token<SubscribeToMediaFilesUC>("SubscribeToMediaFilesUC"),
  "SubscribeToPlaybackUC": token<SubscribeToPlaybackUC>("SubscribeToPlaybackUC"),
}

export const container = new Container();
export const resolve = createResolve(container);

export function init() {
  const restApiService = new RestApiService();

  container.bind<FetchMediaFilesUC>(Dependencies.FetchMediaFilesUC).toFactory(() => new FetchMediaFiles(restApiService));
  container.bind<SubscribeToMediaFilesUC>(Dependencies.SubscribeToMediaFilesUC).toFactory(() => new SubscribeToMediaFiles(restApiService));
  container.bind<SubscribeToPlaybackUC>(Dependencies.SubscribeToPlaybackUC).toFactory(() => new SubscribeToPlayback(restApiService));
}
