import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MediaFile } from "../../plocs/media_files/models";

type Props = {
  mediaFile?: MediaFile,
  currentSubtitleId?: string,
  currentAudioId?: string,
  open: boolean,
  onClose: () => void,
  onOk: (args: { subtitleId: string | undefined, audioId: string | undefined }) => void,
};

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
  }, [handleClose]);

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
  }, [mediaFile])

  const audios = useMemo(() => {
    if (!mediaFile) return [];

    return mediaFile.AudioStreams;
  }, [mediaFile])

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <FormControl>
          <InputLabel id="audio-id-select-label">Audio</InputLabel>
          <Select
            labelId="audio-id-select-label"
            id="audio-id-select"
            value={audioId}
            label="Audio"
            onChange={onAudioChange}
          >
            {
              audios.map(audio => (
                <MenuItem value={audio.AudioID}>{`${audio.Title} (${audio.Language})`}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="subtitle-id-select-label">Subtitles</InputLabel>
          <Select
            labelId="subtitles-id-select-label"
            id="subtitles-id-select"
            value={subtitleId}
            label="Subtitles"
            onChange={onSubtitleChange}
          >
            {
              subtitles.map(subtitle => (
                <MenuItem value={subtitle.SubtitleID}>{`${subtitle.Title} (${subtitle.Language})`}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

