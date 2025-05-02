import { styled } from "@mui/material";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { selectMediaFiles } from "ui/plocs/media_files/selectors";
import { secondsToHHMMSS } from "ui/plocs/playback/functions/formatTime";
import { selectCurrentTime, selectMediaFilePath } from "ui/plocs/playback/selectors";

const ProgressInfoContainer = styled('div')(({
  padding: '10px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%'
}));

const PlaybackTime = styled('span')(({
  flexGrow: 0,
  flexShrink: 1,
  marginRight: 5,
  fontWeight: 'bold',
}));

const PlaybackProgress = styled(LinearProgress)(({
  flexGrow: 1,
  flexShrink: 1,
  [`&.${linearProgressClasses.root}`]: {
    height: '10px'
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: '#1b007a',
  },
}));

export const Progress = () => {
  const mediaFiles = useSelector(selectMediaFiles);
  const playbackMediaFilePath = useSelector(selectMediaFilePath);
  const currentPlaybackTime = useSelector(selectCurrentTime);
  
  const currentMediaFile = useMemo(() => {
    if (!playbackMediaFilePath) return undefined;

    return mediaFiles[playbackMediaFilePath];
  }, [playbackMediaFilePath, mediaFiles]);

  const playbackProgress = useMemo(() => {
    if (!currentMediaFile?.Duration || !currentPlaybackTime) return 0;

    return (currentPlaybackTime / currentMediaFile.Duration) * 100;
  }, [currentPlaybackTime, currentMediaFile?.Duration]);

  const playbackTime = useMemo(() => {
    if (!currentPlaybackTime) return '';

    return secondsToHHMMSS(currentPlaybackTime);
  }, [currentPlaybackTime]);

  const mediaTime = useMemo(() => {
    if (!currentMediaFile?.Duration) return '';

    return secondsToHHMMSS(currentMediaFile.Duration);
  }, [currentMediaFile?.Duration]);

  return (
    <ProgressInfoContainer>
      <PlaybackTime>
        {playbackTime} / {mediaTime}
      </PlaybackTime>
      <PlaybackProgress
        variant="determinate"
        value={playbackProgress}
      />
    </ProgressInfoContainer>
  );
};
