import { Button, Dialog, DialogActions, DialogContent, DialogTitle, SelectChangeEvent, styled } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MediaFile } from "../../../plocs/media_files/models";
import { AudioSelection } from "./controls/AudioSelection";
import { SubtitlesSelection } from "./controls/SubtitlesSelection";

type Props = {
  mediaFile?: MediaFile,
  currentSubtitleId?: string,
  currentAudioId?: string,
  open: boolean,
  onClose: () => void,
  onOk: (args: { subtitleId: string | undefined, audioId: string | undefined }) => void,
};

const LanguageControls = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 5px;
  gap: 10px;
`;

export const AudioSubtitleDialog = ({ mediaFile, currentSubtitleId, currentAudioId, open, onClose, onOk }: Props) => {
  const [subtitleId, setSubtitleId] = useState<string | undefined>(currentSubtitleId);
  const [audioId, setAudioId] = useState<string | undefined>(currentAudioId);

  const handleClose = useCallback(() => {
    onClose();
  }, []);

  const handleOk = useCallback(() => {
    onOk({
      subtitleId,
      audioId,
    });
  }, [subtitleId, audioId]);

  useEffect(() => {
    if (!open || !mediaFile) return;

    setSubtitleId(currentSubtitleId);
    setAudioId(currentAudioId);
  }, [open, mediaFile]);

  const onSubtitleChange = (event: SelectChangeEvent) => {
    setSubtitleId(event.target.value);
  };

  const onAudioChange = (event: SelectChangeEvent) => {
    setAudioId(event.target.value);
  };

  const subtitles = useMemo(() => {
    if (!mediaFile) return [];

    return mediaFile.SubtitleStreams;
  }, [mediaFile]);

  const audios = useMemo(() => {
    if (!mediaFile) return [];

    return mediaFile.AudioStreams;
  }, [mediaFile]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Language options</DialogTitle>
      <DialogContent>
        <LanguageControls>
          <AudioSelection
            audios={audios}
            audioId={audioId}
            onAudioChange={onAudioChange}
          />
          <SubtitlesSelection 
            subtitles={subtitles}
            subtitleId={subtitleId}
            onSubtitleChange={onSubtitleChange}
          />
        </LanguageControls>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

