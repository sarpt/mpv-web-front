import { Container, token, createResolve } from "@owja/ioc";

import { RestApiService } from '../../gateways/restApiService';
import { MediaFilesRepository } from "../../domains/media_files/interfaces";
import { PlaybackRepository } from "../../domains/playback/interfaces";
import { PlaylistsRepository } from "../../domains/playlists/interfaces";

export const Dependencies = {
  "MediaFilesRepository": token<MediaFilesRepository>("MediaFilesRepository"),
  "PlaybackRepository": token<PlaybackRepository>("PlaybackRepository"),
  "PlaylistsRepository": token<PlaylistsRepository>("PlaylistsRepository"),
}

export const container = new Container();
export const resolve = createResolve(container);

export function init() {
  const restApiService = new RestApiService();

  container.bind<MediaFilesRepository>(Dependencies.MediaFilesRepository).toValue(restApiService);
  container.bind<PlaybackRepository>(Dependencies.PlaybackRepository).toValue(restApiService);
  container.bind<PlaylistsRepository>(Dependencies.PlaylistsRepository).toValue(restApiService);
}
