import { Result } from "src/domains/common/either";

export interface ConnectionRepository {
  checkConnection(address: string): Promise<Result<undefined>>,
}
