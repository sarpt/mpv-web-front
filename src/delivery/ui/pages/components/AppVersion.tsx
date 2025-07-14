import { CircularProgress, Link, styled } from "@mui/material";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFrontend } from "ui/plocs/packages/actions";
import { selectCheckingLatestFrontendRelease, selectLatestFrontendRelease, selectShouldUpdateFrontend } from "ui/plocs/packages/selectors";

export const AppVersion = () => {
  return (
    <VersionInfoContainer>
      <div>Version: {APP_VERSION}</div>
      <LatestVersion />
    </VersionInfoContainer>
  );
};

const LatestVersion = () => {
  const latestVersionCheckInProgress = useSelector(selectCheckingLatestFrontendRelease);
  const latestVersionInfo = useSelector(selectLatestFrontendRelease);
  const shouldUpdateFrontend = useSelector(selectShouldUpdateFrontend);

  const dispatch = useDispatch();

  const updateRelease = useCallback(() => {
    if (!latestVersionInfo) return;

    dispatch(updateFrontend(latestVersionInfo));
  }, [dispatch, latestVersionInfo]);

  if (latestVersionCheckInProgress) {
    return <CircularProgress size='1em' />
  }

  if (!latestVersionInfo || !shouldUpdateFrontend) {
    return <></>
  }

  return (
    <div>
      <Link component="button" onClick={() => updateRelease()}>
        New frontend version available: {latestVersionInfo.version}. Click here to update it
      </Link>
    </div>
  )
};

const VersionInfoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
