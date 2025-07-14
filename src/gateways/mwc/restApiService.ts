import { makeErr, makeOk, Result } from "src/domains/common/either";
import { FrontendPackageRelease } from "src/domains/packages/entities";

enum ApiEndpoints {
  FrontendLatest = 'frontend/latest',
  FrontendUpdate = 'frontend/update',
}

type GetLatestPackageResponse = {
  latest_release: FrontendPackageRelease,
  local_version?: string,
  should_update: boolean,
};

export class MpvWebClientRestApiService {
  async getLatestPackage(): Promise<Result<GetLatestPackageResponse>> {
    const url = this.getApiAdddress(ApiEndpoints.FrontendLatest);
    try {
      const result = await fetch(url, {
        method: 'GET',
      });

      const latestPackageRelease = await result.json();
      if (!isGetLatestPackageResponse(latestPackageRelease)) {
        return makeErr(new Error("received latest frontend check result is not a proper frontend package info"));
      }

      return makeOk(latestPackageRelease);
    } catch (err) {
      return makeErr(new Error(`${err}`));
    }
  }

  async updateToPackage(frontendRelease: FrontendPackageRelease): Promise<Result<undefined>> {
    const url = this.getApiAdddress(ApiEndpoints.FrontendUpdate);
    try {
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ version: frontendRelease.version }),
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

function isGetLatestPackageResponse(json: unknown): json is GetLatestPackageResponse {
  if (!json || typeof json !== 'object') return false;

  return 'latest_release' in json && 'local_version' in json && 'should_update' in json && isFrontendPackageRelease(json['latest_release']);
}

function isFrontendPackageRelease(json: unknown): json is FrontendPackageRelease {
  if (!json || typeof json !== 'object') return false;

  return 'name' in json && 'version' in json && 'description' in json;
}