import { Container, token, createResolve } from "@owja/ioc";

import { RestApiService } from 'src/gateways/restApiService';
import { MediaFilesRepository } from "src/domains/media_files/interfaces";
import { PlaybackRepository } from "src/domains/playback/interfaces";
import { PlaylistsRepository } from "src/domains/playlists/interfaces";
import { ConnectionRepository } from "src/domains/connection/interfaces";

export const Dependencies = {
  "ConnectionRepository": token<ConnectionRepository>("ConnectionRepository"),
  "MediaFilesRepository": token<MediaFilesRepository>("MediaFilesRepository"),
  "PlaybackRepository": token<PlaybackRepository>("PlaybackRepository"),
  "PlaylistsRepository": token<PlaylistsRepository>("PlaylistsRepository"),
}

export const container = new Container();
export const resolve = createResolve(container);

export function init() {
  const restApiService = new RestApiService();

  container.bind<ConnectionRepository>(Dependencies.ConnectionRepository).toValue(restApiService);
  container.bind<MediaFilesRepository>(Dependencies.MediaFilesRepository).toValue(restApiService);
  container.bind<PlaybackRepository>(Dependencies.PlaybackRepository).toValue(restApiService);
  container.bind<PlaylistsRepository>(Dependencies.PlaylistsRepository).toValue(restApiService);
}
