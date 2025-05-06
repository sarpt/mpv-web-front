import { checkConnection, connectionFailed, connectionSuccessful } from "./actions";
import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";

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

