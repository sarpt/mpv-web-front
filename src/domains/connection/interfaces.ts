import { Result } from "src/domains/common/either";

export interface ApiServicesRepository {
  checkConnection(address: string): Promise<Result<undefined>>,
}

export interface ApiService {
  connect(address: string): Promise<Result<undefined>>,
}