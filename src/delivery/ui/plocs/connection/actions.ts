import { createAction } from "@reduxjs/toolkit";
import { ConnectionInfo } from "src/delivery/ui/plocs/connection/models";

enum ConnectionActions {
  CheckConnection = 'CheckConnection',
  ConnectionSuccessful = 'ConnectionSuccessful',
  ConnectionFailed = 'ConnectionFailed'
}

export const checkConnection = createAction(ConnectionActions.CheckConnection, (address: string) => {
  return {
    payload: {
      address,
    },
  };
});

export const connectionSuccessful = createAction(ConnectionActions.ConnectionSuccessful, (connectionInfo: ConnectionInfo) => {
  return {
    payload: {
      connectionInfo,
    },
  };
});

export const connectionFailed = createAction(ConnectionActions.ConnectionFailed, (errMsg: string) => {
  return {
    payload: {
      errMsg,
    },
  };
});

