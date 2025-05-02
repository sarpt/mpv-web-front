import { Button, Dialog, DialogActions, DialogContent, DialogTitle, styled } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AudioSelection } from "./controls/AudioSelection";
import { SubtitlesSelection } from "./controls/SubtitlesSelection";
import { MediaFile } from "src/domains/media_files/entities";

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
  }, [onClose]);

  const handleOk = useCallback(() => {
    onOk({
      subtitleId,
      audioId,
    });
  }, [onOk, subtitleId, audioId]);

  useEffect(() => {
    if (!open || !mediaFile) return;

    setSubtitleId(currentSubtitleId);
    setAudioId(currentAudioId);
  }, [open, mediaFile, currentSubtitleId, currentAudioId]);

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
            onAudioChange={setAudioId}
          />
          <SubtitlesSelection 
            subtitles={subtitles}
            subtitleId={subtitleId}
            onSubtitleChange={setSubtitleId}
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

