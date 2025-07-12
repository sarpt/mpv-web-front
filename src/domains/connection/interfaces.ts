import { Result } from "src/domains/common/either";

export interface MpvWebApiServicesRepository {
  checkConnection(address: string): Promise<Result<undefined>>,
}

export interface MpvWebApiService {
  connect(address: string): Promise<Result<undefined>>,
}
