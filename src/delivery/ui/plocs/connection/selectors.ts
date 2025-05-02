import { createSelector } from "@reduxjs/toolkit"

import { selectStoreState } from "../../reducers";

const selectConnectionState = createSelector(selectStoreState, (state) => state.connections);

export const selectConnectionInfo = createSelector(
  selectConnectionState,
  (state) => state.info
);

export const selectConnected = createSelector(
  selectConnectionState,
  (state) => state.info?.connected
);

export const selectConnectionCheckInProgress = createSelector(
  selectConnectionState,
  (state) => state.loading
);
