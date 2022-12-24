import { styled } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMediaFiles } from "../../plocs/media_files/selectors";
import { fetchPlayback } from "../../plocs/playback/actions";
import { selectPlayback } from "../../plocs/playback/selectors";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { secondsToHHMMSS } from "../../plocs/playback/functions/formatTime";

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

const PlaybackContainer = styled('div')(({
  padding: '10px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}));

const PlaybackTime = styled('span')(({
  flexGrow: 0,
  flexShrink: 1,
  marginRight: 5,
  fontWeight: 'bold',
}));

export const PlaybackControls = () => {
  const playback = useSelector(selectPlayback);
  const mediaFiles = useSelector(selectMediaFiles);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPlayback());
  }, []);

  const currentMediaFile = useMemo(() => {
    if (!playback?.MediaFilePath) return undefined;

    return mediaFiles[playback.MediaFilePath];
  }, [playback?.MediaFilePath, mediaFiles]);

  const playbackProgress = useMemo(() => {
    if (!currentMediaFile?.Duration || !playback?.CurrentTime) return 0;

    return (playback.CurrentTime / currentMediaFile.Duration) * 100;
  }, [playback?.CurrentTime, currentMediaFile?.Duration]);

  const playbackTime = useMemo(() => {
    if (!playback?.CurrentTime) return '';

    return secondsToHHMMSS(playback.CurrentTime);
  }, [playback?.CurrentTime]);

  const mediaTime = useMemo(() => {
    if (!currentMediaFile?.Duration) return '';

    return secondsToHHMMSS(currentMediaFile.Duration);
  }, [currentMediaFile?.Duration]);

  return (
    <PlaybackContainer>
      <PlaybackTime>
        {playbackTime} / {mediaTime}
      </PlaybackTime>
      <PlaybackProgress variant="determinate" value={playbackProgress} />
    </PlaybackContainer>
  );
};
