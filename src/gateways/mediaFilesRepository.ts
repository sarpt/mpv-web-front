import { Result } from "src/domains/common/either";
import { MediaFilesMap } from "src/domains/media_files/entities";
import { MediaFilesEvents, MediaFilesRepository } from "src/domains/media_files/interfaces";
import { RestApiService } from "src/gateways/restApiService";
import { SSEApiService } from "src/gateways/sseApiService";

export class MediaFilesServicesRepo implements MediaFilesRepository {
  constructor(
    private readonly _restApi: RestApiService,
    private readonly sseApi: SSEApiService
  ) {}

  iterateMediaFiles(): Result<AsyncGenerator<Awaited<{ eventVariant: MediaFilesEvents; payload: MediaFilesMap; }>, void, unknown>> {
    return this.sseApi.iterateMediaFiles();
  }
}
