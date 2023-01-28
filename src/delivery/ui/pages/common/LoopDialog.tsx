import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { LoopVariant } from "../../plocs/playback/models";

type Props = {
  currentVariant: LoopVariant,
  open: boolean,
  onClose: () => void,
  onOk: (variant: LoopVariant) => void,
};

export const LoopDialog = ({ currentVariant, open, onClose, onOk }: Props) => {
  const [loopValue, setLoopValue] = useState<LoopVariant>(currentVariant);

  const handleClose = useCallback(() => {
    onClose();
  }, []);

  const handleOk = useCallback(() => {
    onOk(loopValue);
  }, [handleClose]);

  useEffect(() => {
    if (open) setLoopValue(currentVariant);
  }, [open]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoopValue((event.target as HTMLInputElement).value as LoopVariant);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <FormControl>
          <RadioGroup
            aria-labelledby="loop-choice"
            name="loop-radio-group"
            value={loopValue}
            onChange={onChange}
          >
            <FormControlLabel value={LoopVariant.File} control={<Radio />} label="Currently playing" />
            <FormControlLabel value={LoopVariant.Playlist} control={<Radio />} label="Playlist" disabled={true} />
            <FormControlLabel value={LoopVariant.AB} control={<Radio />} label="A-B" disabled={true} />
            <FormControlLabel value={LoopVariant.Off} control={<Radio />} label="Off" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};
