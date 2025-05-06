import { Container, token, createResolve } from "@owja/ioc";

import { RestApiService } from 'src/gateways/restApiService';
import { MediaFilesRepository } from "src/domains/media_files/interfaces";
import { PlaybackRepository } from "src/domains/playback/interfaces";
import { PlaylistsRepository } from "src/domains/playlists/interfaces";
import { ApiServicesRepository } from "src/domains/connection/interfaces";
import { SSEApiService } from "src/gateways/sseApiService";
import { ApiServices } from "src/gateways/apiServicesRepository";
import { MediaFilesServicesRepo } from "src/gateways/mediaFilesRepository";

export const Dependencies = {
  "ApiServicesRepository": token<ApiServicesRepository>("ApiServicesRepository"),
  "MediaFilesRepository": token<MediaFilesRepository>("MediaFilesRepository"),
  "PlaybackRepository": token<PlaybackRepository>("PlaybackRepository"),
  "PlaylistsRepository": token<PlaylistsRepository>("PlaylistsRepository"),
}

export const container = new Container();
export const resolve = createResolve(container);

export function init() {
  const restApiService = new RestApiService();
  const sseApiService = new SSEApiService();
  const apiServicesRepo = new ApiServices([restApiService, sseApiService]);
  const mediaFilesRepo = new MediaFilesServicesRepo(restApiService, sseApiService);

  container.bind<ApiServicesRepository>(Dependencies.ApiServicesRepository).toValue(apiServicesRepo);
  container.bind<MediaFilesRepository>(Dependencies.MediaFilesRepository).toValue(mediaFilesRepo);
  container.bind<PlaybackRepository>(Dependencies.PlaybackRepository).toValue(restApiService);
  container.bind<PlaylistsRepository>(Dependencies.PlaylistsRepository).toValue(restApiService);
}
