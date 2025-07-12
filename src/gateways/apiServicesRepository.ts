import { makeErr, makeOk, Result } from "src/domains/common/either";
import { MpvWebApiService, MpvWebApiServicesRepository } from "src/domains/connection/interfaces";

export class MpvWebApiServices implements MpvWebApiServicesRepository {
  constructor(private readonly services: MpvWebApiService[]) {};

  async checkConnection(address: string): Promise<Result<undefined>> {
    for (const service of this.services) {
      const result = await service.connect(address);
      if (result.isErr()) return makeErr(result.err());
    }
    
    return makeOk(undefined);
  }
}
