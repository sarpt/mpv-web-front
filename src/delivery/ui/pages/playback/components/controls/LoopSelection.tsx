import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { LoopVariant } from "../../../../plocs/playback/models";

type Props = {
    loopValue: LoopVariant,
    onChange: (variant: LoopVariant) => void
};

export const LoopSelection = ({ loopValue, onChange }: Props) => {
    return (
        <FormControl>
          <RadioGroup
            aria-labelledby="loop-choice"
            name="loop-radio-group"
            value={loopValue}
            onChange={event => onChange(event.target.value as LoopVariant)}
          >
            <FormControlLabel value={LoopVariant.File} control={<Radio />} label="Currently playing" />
            <FormControlLabel value={LoopVariant.Playlist} control={<Radio />} label="Playlist" disabled={true} />
            <FormControlLabel value={LoopVariant.AB} control={<Radio />} label="A-B" disabled={true} />
            <FormControlLabel value={LoopVariant.Off} control={<Radio />} label="Off" />
          </RadioGroup>
        </FormControl>
    );
}
