import { LinearProgress } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectMediaFiles } from "../../plocs/media_files/selectors";
import { selectPlayback } from "../../plocs/playback/selectors";

export const PlaybackControls = () => {
  const playback = useSelector(selectPlayback);
  const mediaFiles = useSelector(selectMediaFiles);

  const currentMediaFile = useMemo(() => {
    if (!playback) return undefined;

    return mediaFiles[playback.MediaFilePath];
  }, [playback, mediaFiles]);

  const playbackProgress = useMemo(() => {
    if (!currentMediaFile || !currentMediaFile.Duration || !playback?.CurrentTime) return 0;

    return (playback.CurrentTime / currentMediaFile.Duration) * 100;
  }, [playback, currentMediaFile]);

  return (
    <div>
      <LinearProgress variant="determinate" value={playbackProgress} />
    </div>
  );
};
