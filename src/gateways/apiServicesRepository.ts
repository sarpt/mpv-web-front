import { makeErr, makeOk, Result } from "src/domains/common/either";
import { ApiService, ApiServicesRepository } from "src/domains/connection/interfaces";

export class ApiServices implements ApiServicesRepository {
  constructor(private readonly services: ApiService[]) {};

  async checkConnection(address: string): Promise<Result<undefined>> {
    for (const service of this.services) {
      const result = await service.connect(address);
      if (result.isErr()) return makeErr(result.err());
    }
    
    return makeOk(undefined);
  }
}