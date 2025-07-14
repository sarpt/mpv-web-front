import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Link, styled } from "@mui/material";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FrontendPackageRelease } from "src/domains/packages/entities";
import { updateFrontend } from "ui/plocs/packages/actions";
import { selectCheckingLatestFrontendRelease, selectLatestFrontendRelease, selectShouldUpdateFrontend } from "ui/plocs/packages/selectors";

export const AppVersion = () => {
  const dispatch = useDispatch();
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);

  const latestVersionCheckInProgress = useSelector(selectCheckingLatestFrontendRelease);
  const latestVersionInfo = useSelector(selectLatestFrontendRelease);
  const shouldUpdateFrontend = useSelector(selectShouldUpdateFrontend);

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
        open={updateDialogOpen}
        pkgRelease={latestVersionInfo}
        onClose={() => setUpdateDialogOpen(false)}
        onUpdate={updateRelease}
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

const VersionInfoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type UpdateDialogProps = {
  open: boolean,
  onUpdate: () => void,
  onClose: () => void,
  pkgRelease: FrontendPackageRelease | undefined,
};

const UpdateDialog = ({
  open,
  pkgRelease,
  onUpdate,
  onClose
}: UpdateDialogProps) => {
  if (!pkgRelease) return <></>;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Frontend version {pkgRelease.version}</DialogTitle>
      <DialogContent>
        {pkgRelease.description}
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
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
