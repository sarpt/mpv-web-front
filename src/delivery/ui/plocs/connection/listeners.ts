import { checkConnection, connectionFailed, connectionSuccessful } from "./actions";
import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";
import { selectConnectionInfo } from "ui/plocs/connection/selectors";

export const checkConnectionEffect = async (action: ReturnType<typeof checkConnection>, listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.ApiServicesRepository)();
  const connected = await repo.checkConnection(action.payload.address);

  connected.match(
    () => {
      listenerApi.dispatch(connectionSuccessful({ address: action.payload.address, connected: true }));
    },
    (err) => {
      listenerApi.dispatch(connectionFailed(`could not estabilish connection to "${action.payload.address}": reason: ${err}`));
    }
  );
};

const connectionRetryIntervalMs = 5000;
export const scheduleNextConnectionCheck = async (_action: ReturnType<typeof connectionFailed>, listenerApi: AppListenerEffectAPI) => {
  const address = selectConnectionInfo(listenerApi.getState()).address;
  const fork = listenerApi.fork(async (forkedTaskApi) => {
    await forkedTaskApi.delay(connectionRetryIntervalMs);
    listenerApi.dispatch(checkConnection(address))
  });
  
  // cancel next connection check when connection check has been triggered outside of
  // scheduled checked in the fork above - probably by the user that just have changed the address
  await listenerApi.take(checkConnection.match);
  fork.cancel();
};

