import { createAction } from "@reduxjs/toolkit";
import { FrontendPackageRelease } from "src/domains/packages/entities";

enum PackageActions {
  CheckLatestFrontendRelease = 'CheckLatestFrontendRelease',
  LatestFrontendReleaseCheckSuccsessful = 'LatestFrontendReleaseCheckSuccsessful',
  LatestFrontendReleaseCheckFailed = 'LatestFrontendReleaseCheckFailed',
  UpdateFrontend = 'UpdateFrontend',
  FrontendUpdateSuccessful = 'FrontendUpdateSuccessful',
  FrontendUpdateFailed = 'FrontendUpdateFailed',
}

export const checkLatestFrontendRelease = createAction(PackageActions.CheckLatestFrontendRelease);

export const latestFrontendReleaseCheckSuccessful = createAction(PackageActions.LatestFrontendReleaseCheckSuccsessful, (frontendPackageRelease: FrontendPackageRelease, shouldUpdate: boolean) => {
  return {
    payload: {
      frontendPackageRelease,
      shouldUpdate
    },
  };
});

export const latestFrontendReleaseCheckFailed = createAction(PackageActions.LatestFrontendReleaseCheckFailed, (errMsg: string) => {
  return {
    payload: {
      errMsg,
    },
  };
});

export const updateFrontend = createAction(PackageActions.UpdateFrontend, (frontedPackageRelease: FrontendPackageRelease) => {
  return {
    payload: {
      frontedPackageRelease,
    },
  };
});

export const frontendUpdateSuccessful = createAction(PackageActions.FrontendUpdateSuccessful);

export const frontendUpdateFailed = createAction(PackageActions.FrontendUpdateFailed, (errMsg: string) => {
  return {
    payload: {
      errMsg,
    },
  };
});

