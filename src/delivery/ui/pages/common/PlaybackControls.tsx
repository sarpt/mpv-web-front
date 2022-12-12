import { LinearProgress } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMediaFiles } from "../../plocs/media_files/selectors";
import { fetchPlayback } from "../../plocs/playback/actions";
import { selectPlayback } from "../../plocs/playback/selectors";

export const PlaybackControls = () => {
  const playback = useSelector(selectPlayback);
  const mediaFiles = useSelector(selectMediaFiles);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPlayback());
  }, []);

  const currentMediaFile = useMemo(() => {
    if (!playback) return undefined;

    return mediaFiles[playback.MediaFilePath];
  }, [playback?.MediaFilePath, mediaFiles]);

  const playbackProgress = useMemo(() => {
    if (!currentMediaFile || !currentMediaFile.Duration || !playback?.CurrentTime) return 0;

    return (playback.CurrentTime / currentMediaFile.Duration) * 100;
  }, [playback?.CurrentTime, currentMediaFile?.Duration]);

  return (
    <div>
      <LinearProgress variant="determinate" value={playbackProgress} />
    </div>
  );
};
