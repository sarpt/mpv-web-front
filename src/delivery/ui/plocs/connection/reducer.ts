import { AnyAction } from "redux"
import { checkConnection, connectionFailed, connectionSuccessful } from "ui/plocs/connection/actions";
import { ConnectionInfo } from "ui/plocs/connection/models";

type State = {
  info: ConnectionInfo,
  loading: boolean,
  errMsg?: string,
};

const initialState: State = {
  loading: true,
  info: {
    address: 'unknown',
    connected: false
  }
};

export default function connectionReducer(state = initialState, action: AnyAction): State {
  if (checkConnection.match(action)) {
    return {
      ...state,
      info: {
        address: action.payload.address,
        connected: false
      },
      loading: true,
      errMsg: undefined,
    };
  }


  if (connectionSuccessful.match(action)) {
    return {
      ...state,
      info: {
        ...action.payload.connectionInfo,
        connected: true
      },
      loading: false
    };
  }

  if (connectionFailed.match(action)) {
    return {
      ...state,
      errMsg: action.payload.errMsg,
      info: {
        ...state.info,
        connected: false
      },
      loading: false,
    };
  }

  return state;
}
