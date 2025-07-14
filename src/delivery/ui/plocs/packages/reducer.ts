import { UnknownAction } from "redux"
import { FrontendPackageRelease } from "src/domains/packages/entities";
import { checkLatestFrontendRelease, frontendUpdateFailed, frontendUpdateSuccessful, latestFrontendReleaseCheckFailed, latestFrontendReleaseCheckSuccessful, updateFrontend } from "ui/plocs/packages/actions";

type State = {
  latestFrontendRelease?: FrontendPackageRelease,
  shouldUpdateFrontend: boolean,
  checkingLatestFrontend: boolean,
  updatingFrontend: boolean,
  frontendReloadNeeded: boolean,
  errMsg?: string,
};

const initialState: State = {
  shouldUpdateFrontend: false,
  checkingLatestFrontend: false,
  updatingFrontend: false,
  frontendReloadNeeded: false,
};

export default function packagesReducer(state = initialState, action: UnknownAction): State {
  if (checkLatestFrontendRelease.match(action)) {
    return {
      ...state,
      checkingLatestFrontend: true,
    };
  }


  if (latestFrontendReleaseCheckSuccessful.match(action)) {
    return {
      ...state,
      latestFrontendRelease: action.payload.frontendPackageRelease,
      shouldUpdateFrontend: action.payload.shouldUpdate,
      checkingLatestFrontend: false,
    };
  }

  if (latestFrontendReleaseCheckFailed.match(action)) {
    return {
      ...state,
      errMsg: action.payload.errMsg,
      checkingLatestFrontend: false,
    };
  }

  if (updateFrontend.match(action)) {
    return {
      ...state,
      updatingFrontend: true,
    };
  }

  if (frontendUpdateSuccessful.match(action)) {
    return {
      ...state,
      errMsg: undefined,
      updatingFrontend: false,
      frontendReloadNeeded: true,
    };
  }

  if (frontendUpdateFailed.match(action)) {
    return {
      ...state,
      errMsg: action.payload.errMsg,
      updatingFrontend: false,
    };
  }

  return state;
}
