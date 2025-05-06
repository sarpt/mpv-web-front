import { Result } from "src/domains/common/either";
import { MediaFilesMap } from "src/domains/media_files/entities";
import { MediaFilesRepository } from "src/domains/media_files/interfaces";
import { RestApiService } from "src/gateways/restApiService";
import { SSEApiService } from "src/gateways/sseApiService";

export class MediaFilesServicesRepo implements MediaFilesRepository {
  constructor(private readonly restApi: RestApiService, private readonly sseApi: SSEApiService) {}

  async fetchMediaFiles(): Promise<MediaFilesMap> {
    return this.restApi.fetchMediaFiles();
  }

  iterateAddedMediaFiles(): Result<AsyncGenerator<Awaited<MediaFilesMap>, void, unknown>> {
    return this.sseApi.iterateAddedMediaFiles();
  }

  iterateRemovedMediaFiles(): Result<AsyncGenerator<Awaited<MediaFilesMap>, void, unknown>> {
    return this.sseApi.iterateRemovedMediaFiles();
  }
}
