export interface ConnectionRepository {
  checkConnection(address: string): Promise<boolean>,
}
