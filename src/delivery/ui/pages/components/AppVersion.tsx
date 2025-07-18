import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Link, styled } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FrontendPackageRelease } from "src/domains/packages/entities";
import { updateFrontend } from "ui/plocs/packages/actions";
import {
  selectCheckingLatestFrontendRelease,
  selectFrontendReloadNeeded,
  selectIsFrontendUpdateInProgress,
  selectLatestFrontendRelease,
  selectShouldUpdateFrontend
} from "ui/plocs/packages/selectors";

export const AppVersion = () => {
  const dispatch = useDispatch();
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);

  const latestVersionCheckInProgress = useSelector(selectCheckingLatestFrontendRelease);
  const isFrontendUpdateInProgress = useSelector(selectIsFrontendUpdateInProgress);
  const latestVersionInfo = useSelector(selectLatestFrontendRelease);
  const shouldUpdateFrontend = useSelector(selectShouldUpdateFrontend);
  const frontendReloadNeeded = useSelector(selectFrontendReloadNeeded);

  const updateRelease = useCallback(() => {
    if (!latestVersionInfo) return;

    dispatch(updateFrontend(latestVersionInfo));
  }, [dispatch, latestVersionInfo]);


  return (
    <VersionInfoContainer>
      <div>Version: {APP_VERSION}</div>
      <LatestVersion
        latestVersionCheckInProgress={latestVersionCheckInProgress}
        latestVersionInfo={latestVersionInfo}
        shouldUpdateFrontend={shouldUpdateFrontend}
        onUpdate={() => setUpdateDialogOpen(true)}
      />
      <UpdateDialog
        isFrontendUpdateInProgress={isFrontendUpdateInProgress}
        frontendReloadNeeded={frontendReloadNeeded}
        open={updateDialogOpen}
        pkgRelease={latestVersionInfo}
        onClose={() => setUpdateDialogOpen(false)}
        onUpdate={updateRelease}
        onReload={onReload}
      />
    </VersionInfoContainer>
  );
};

type LatestVersionProps = {
  latestVersionCheckInProgress: boolean,
  latestVersionInfo: FrontendPackageRelease | undefined,
  shouldUpdateFrontend: boolean,
  onUpdate: () => void,
};

const LatestVersion = ({
  latestVersionCheckInProgress,
  latestVersionInfo,
  shouldUpdateFrontend,
  onUpdate
}: LatestVersionProps) => {
  if (latestVersionCheckInProgress) {
    return <CircularProgress size='1em' />
  }

  if (!latestVersionInfo || !shouldUpdateFrontend) {
    return <></>
  }

  return (
    <Link component="button" onClick={onUpdate}>
      New frontend version available: {latestVersionInfo.version}. Click here to update it
    </Link>
  )
};

type UpdateDialogProps = {
  isFrontendUpdateInProgress: boolean,
  frontendReloadNeeded: boolean,
  open: boolean,
  onUpdate: () => void,
  onClose: () => void,
  pkgRelease: FrontendPackageRelease | undefined,
  onReload: () => void,
};

const UpdateDialog = ({
  isFrontendUpdateInProgress,
  frontendReloadNeeded,
  open,
  pkgRelease,
  onUpdate,
  onClose,
  onReload
}: UpdateDialogProps) => {
  if (!pkgRelease) return <></>;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Frontend version {pkgRelease.version}</DialogTitle>
      <DialogContent>
        <UpdateDialogContent>
          <span>{pkgRelease.description}</span>
          {
            isFrontendUpdateInProgress && (
              <UpdateProgressContainer>
                <LinearProgress variant="indeterminate" />
                <span>Update in progress...</span>
              </UpdateProgressContainer>
            )
          }
          {
            frontendReloadNeeded && (
              <UpdateSuccessContainer>
                <UpdateSuccededInfo>Update succeeded</UpdateSuccededInfo>
                <Link component="button" onClick={onReload}>
                  Please reload the browser tab.
                </Link>
              </UpdateSuccessContainer>
            )
          }
        </UpdateDialogContent>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onUpdate}
          disabled={isFrontendUpdateInProgress || frontendReloadNeeded}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ColumnFlex = styled('div')`
  display: flex;
  flex-direction: column;
`;

const UpdateDialogContent = styled(ColumnFlex)`
  gap: 8px;
`;

const UpdateSuccededInfo = styled('span')`
  color: green;  
  font-weight: bold;
`;

const UpdateProgressContainer = styled(ColumnFlex)`
  text-align: center;
`;

const UpdateSuccessContainer = styled(ColumnFlex)`
  align-items: center;
`;

const VersionInfoContainer = styled(ColumnFlex)`
  align-items: center;
`;

const onReload = () => {
  window.location.reload();
};
