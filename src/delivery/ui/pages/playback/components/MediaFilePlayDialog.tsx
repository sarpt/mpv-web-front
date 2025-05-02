import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCallback, useState } from "react";
import styled from "styled-components";

import { LoopVariant } from "ui/plocs/playback/models";

import { AudioSelection } from "./controls/AudioSelection";
import { SubtitlesSelection } from "./controls/SubtitlesSelection";
import { LoopSelection } from "./controls/LoopSelection";
import { MediaFile } from "src/domains/media_files/entities";

type onOkCallback = (args: {
  subtitleId: string | undefined,
  audioId: string | undefined,
  loopVariant: LoopVariant | undefined,
  addToPlaylist: boolean
}) => void

type Props = {
  currentLoopVariant?: LoopVariant,
  mediaFile?: MediaFile,
  open: boolean,
  onClose: () => void,
  onOk: onOkCallback,
};

const defaultLoopVariant = LoopVariant.Off;

export const MediaFilePlayDialog = ({ mediaFile, open, onClose, onOk, currentLoopVariant }: Props) => {
  const [subtitleId, setSubtitleId] = useState<string | undefined>(mediaFile?.AudioStreams[0]?.AudioID);
  const [audioId, setAudioId] = useState<string | undefined>(mediaFile?.SubtitleStreams[0]?.SubtitleID);
  const [loopVariant, setLoopVariant] = useState<LoopVariant>(currentLoopVariant ?? defaultLoopVariant);

  const handleAppendToPlaylist = useCallback(() => {
    onOk({
      addToPlaylist: true,
      subtitleId,
      audioId,
      loopVariant
    });
  }, [subtitleId, audioId, loopVariant, onOk]);

  const handlePlay = useCallback(() => {
    onOk({
      addToPlaylist: false,
      subtitleId,
      audioId,
      loopVariant
    });
  }, [subtitleId, audioId, loopVariant, onOk]);

  if (!mediaFile) return (<></>);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Playback options: {mediaFile.Title}</DialogTitle>
      <DialogContent>
        <DialogContentContainer>
          <AudioSelection audios={mediaFile.AudioStreams} audioId={audioId} onAudioChange={setAudioId} />
          <SubtitlesSelection subtitles={mediaFile.SubtitleStreams} subtitleId={subtitleId} onSubtitleChange={ setSubtitleId } />
          <LoopSelection loopValue={loopVariant} onChange={ setLoopVariant } />
        </DialogContentContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAppendToPlaylist}>Append to playlist</Button>
        <Button onClick={handlePlay}>Play</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const DialogContentContainer = styled('div')({ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '5px' });