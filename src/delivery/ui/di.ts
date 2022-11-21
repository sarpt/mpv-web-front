import { RestApiService } from '../../domains/api_service/gateways.ts/restApiService';
import {
  container as mediaFilesContainer,
  Dependencies as MediaFilesDependencies,
} from '../../domains/media_files/di';
import { MediaFilesRepository } from '../../domains/media_files/gateways/interfaces';

import { FetchMediaFiles, FetchMediaFilesUC } from '../../domains/media_files/usecases/fetchMediaFiles';

export function init() {
  mediaFilesContainer.bind<FetchMediaFilesUC>(MediaFilesDependencies.FetchMediaFilesUC).to(FetchMediaFiles);
  mediaFilesContainer.bind<MediaFilesRepository>(MediaFilesDependencies.MediaFilesRepository).to(RestApiService).inSingletonScope();
}
