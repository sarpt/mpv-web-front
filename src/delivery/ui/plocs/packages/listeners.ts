import { checkLatestFrontendRelease, latestFrontendReleaseCheckFailed, latestFrontendReleaseCheckSuccessful } from 'ui/plocs/packages/actions';
import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";

export const checkLatestFrontendReleaseEffect = async (_action: ReturnType<typeof checkLatestFrontendRelease>, listenerApi: AppListenerEffectAPI) => {
  const service = resolve(Dependencies.MpvWebClientRestApiService)();
  const latestPackageResult = await service.getLatestPackage();

  latestPackageResult.match(
    (response) => {
      listenerApi.dispatch(latestFrontendReleaseCheckSuccessful(response.latest_release, response.should_update));
    },
    (err) => {
      listenerApi.dispatch(latestFrontendReleaseCheckFailed(`could not check for the latest frontend release, reason: ${err}`));
    }
  );
};

