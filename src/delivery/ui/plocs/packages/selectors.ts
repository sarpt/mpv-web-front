import { createSelector } from "@reduxjs/toolkit"

import { selectStoreState } from "../../reducers";

const selectPackagesState = createSelector(selectStoreState, (state) => state.packages);

export const selectCheckingLatestFrontendRelease = createSelector(
  selectPackagesState,
  (state) => state.checkingLatestFrontend
);

export const selectIsFrontendUpdateInProgress = createSelector(
  selectPackagesState,
  (state) => state.frontendUpdateInProgress
);

export const selectFrontendReloadNeeded = createSelector(
  selectPackagesState,
  (state) => state.frontendReloadNeeded
);

export const selectLatestFrontendRelease = createSelector(
  selectPackagesState,
  (state) => state.latestFrontendRelease
);

export const selectShouldUpdateFrontend = createSelector(
  selectPackagesState,
  (state) => state.shouldUpdateFrontend
);

