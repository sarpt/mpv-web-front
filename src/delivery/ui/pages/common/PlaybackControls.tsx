import { IconButton, styled } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Pause } from "@mui/icons-material";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { selectMediaFiles } from "../../plocs/media_files/selectors";
import { pause, subscribeToPlayback, unsubscribeToPlayback } from "../../plocs/playback/actions";
import { selectPlayback } from "../../plocs/playback/selectors";
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
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

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

const ButtonsContainer = styled('div')(({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}))

const PlaybackControlButton = styled(IconButton)(({ theme }) => {
  return {
    color: theme.palette.primary.contrastText
  };
})

export const PlaybackControls = () => {
  const playback = useSelector(selectPlayback);
  const mediaFiles = useSelector(selectMediaFiles);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(subscribeToPlayback());
  
    return () => {
      dispatch(unsubscribeToPlayback());
    };
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

  const togglePlayback = useCallback(() => {
    dispatch(pause(!playback?.Paused));
  }, [playback?.Paused]);

  return (
    <PlaybackContainer>
      <ProgressInfoContainer>
        <PlaybackTime>
          {playbackTime} / {mediaTime}
        </PlaybackTime>
        <PlaybackProgress
          variant="determinate"
          value={playbackProgress}
        />
      </ProgressInfoContainer>
      <ButtonsContainer>
        <PlaybackControlButton
          aria-label="playChange"
          onClick={togglePlayback}
          disabled={!playback?.MediaFilePath}
        >
          {
            playback?.Paused
              ? <PlayArrowIcon />
              : <Pause />
          }
        </PlaybackControlButton>
      </ButtonsContainer>
    </PlaybackContainer>
  );
};
