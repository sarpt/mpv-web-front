import { makeErr, makeOk, Result } from "src/domains/common/either";
import { FrontendPackageRelease } from "src/domains/packages/entities";

enum ApiEndpoints {
  FrontendLatest = 'frontend/latest',
  FrontendUpdate = 'frontend/update',
}

export class MpvWebClientRestApiService {
  async getLatestPackage(): Promise<Result<FrontendPackageRelease>> {
    const url = this.getApiAdddress(ApiEndpoints.FrontendLatest);
    try {
      const result = await fetch(url, {
        method: 'GET',
      });

      const latestPackageRelease = await result.json();
      if (!isFrontendPackageRelease(latestPackageRelease)) {
        return makeErr(new Error("received latest frontend check result is not a proper frontend package info"));
      }

      return makeOk(latestPackageRelease);
    } catch (err) {
      return makeErr(new Error(`${err}`));
    }
  }

  async updateToPackage(frontendRelease: FrontendPackageRelease): Promise<Result<undefined>> {
    const url = this.getApiAdddress(ApiEndpoints.FrontendUpdate);
    const formData = new FormData();
    formData.set('name', frontendRelease.name);
    formData.set('version', frontendRelease.version);
    formData.set('description', frontendRelease.description);

    try {
      await fetch(url, {
        method: 'POST',
        body: formData,
      });
      return makeOk(undefined);
    } catch (err) {
      return makeErr(new Error(`${err}`));
    }
  }

  private getApiAdddress(endpoint: ApiEndpoints): string {
    return `${location.protocol}//${location.host}/api/${endpoint}`;
  }
}

function isFrontendPackageRelease(json: unknown): json is FrontendPackageRelease {
  if (!json || typeof json !== 'object') return false;

  return 'name' in json && 'version' in json && 'description' in json;
}