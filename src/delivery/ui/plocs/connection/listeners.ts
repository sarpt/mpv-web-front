import { checkConnection, connectionFailed, connectionSuccessful } from "./actions";
import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";

export const checkConnectionEffect = async (action: ReturnType<typeof checkConnection>, listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.ConnectionRepository)();
  const connected = await repo.checkConnection(action.payload.address);

  if (connected) {
    listenerApi.dispatch(connectionSuccessful({ address: action.payload.address, connected: true }));
  } else {
    listenerApi.dispatch(connectionFailed(`could not estabilish connection to: ${action.payload.address}`));
  }
};

