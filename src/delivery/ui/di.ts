import { Container, token, createResolve } from "@owja/ioc";

import { RestApiService } from 'src/gateways/mwa/restApiService';
import { MediaFilesRepository } from "src/domains/media_files/interfaces";
import { PlaybackRepository } from "src/domains/playback/interfaces";
import { PlaylistsRepository } from "src/domains/playlists/interfaces";
import { MpvWebApiServicesRepository } from "src/domains/connection/interfaces";
import { SSEApiService } from "src/gateways/mwa/sseApiService";
import { MpvWebApiServices } from "src/gateways/apiServicesRepository";
import { MediaFilesServicesRepo } from "src/gateways/mediaFilesRepository";
import { PlaybackServicesRepo } from "src/gateways/playbackRepository";
import { PlaylistsSeriveRepo } from "src/gateways/playlistsRepository";
import { MpvWebClientRestApiService } from "src/gateways/mwc/restApiService";

export const Dependencies = {
  "ApiServicesRepository": token<MpvWebApiServicesRepository>("ApiServicesRepository"),
  "MediaFilesRepository": token<MediaFilesRepository>("MediaFilesRepository"),
  "PlaybackRepository": token<PlaybackRepository>("PlaybackRepository"),
  "PlaylistsRepository": token<PlaylistsRepository>("PlaylistsRepository"),
  "MpvWebClientRestApiService": token<MpvWebClientRestApiService>("MpvWebClientRestApiService"),
}

export const container = new Container();
export const resolve = createResolve(container);

export function init() {
  const restApiService = new RestApiService();
  const sseApiService = new SSEApiService();
  const apiServicesRepo = new MpvWebApiServices([restApiService, sseApiService]);
  const mediaFilesRepo = new MediaFilesServicesRepo(restApiService, sseApiService);
  const playbackRepo = new PlaybackServicesRepo(restApiService, sseApiService);
  const playlistsRepo = new PlaylistsSeriveRepo(sseApiService);
  const mwcRestApiService = new MpvWebClientRestApiService();

  container.bind<MpvWebClientRestApiService>(Dependencies.MpvWebClientRestApiService).toValue(mwcRestApiService);
  container.bind<MpvWebApiServicesRepository>(Dependencies.ApiServicesRepository).toValue(apiServicesRepo);
  container.bind<MediaFilesRepository>(Dependencies.MediaFilesRepository).toValue(mediaFilesRepo);
  container.bind<PlaybackRepository>(Dependencies.PlaybackRepository).toValue(playbackRepo);
  container.bind<PlaylistsRepository>(Dependencies.PlaylistsRepository).toValue(playlistsRepo);
}
