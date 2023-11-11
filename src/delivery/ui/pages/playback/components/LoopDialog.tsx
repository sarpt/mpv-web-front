import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { LoopVariant } from "../../../plocs/playback/models";
import { LoopSelection } from "./controls/LoopSelection";

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
  }, [handleClose, loopValue]);

  useEffect(() => {
    if (open) setLoopValue(currentVariant);
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Loop</DialogTitle>
      <DialogContent>
        <LoopSelection
          loopValue={loopValue}
          onChange={setLoopValue}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};
