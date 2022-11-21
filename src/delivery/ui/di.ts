import { Container, token, createResolve } from "@owja/ioc";

import { FetchMediaFiles, FetchMediaFilesUC } from '../../domains/media_files/usecases/fetchMediaFiles';
import { RestApiService } from '../../gateways/api_service/restApiService';

export const Dependencies = {
  "FetchMediaFilesUC": token<FetchMediaFilesUC>("FetchMediaFilesUC"),
}

export const container = new Container();
export const resolve = createResolve(container);

export function init() {
  const restApiService = new RestApiService();

  container.bind<FetchMediaFilesUC>(Dependencies.FetchMediaFilesUC).toFactory(() => new FetchMediaFiles(restApiService));
}
