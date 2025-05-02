import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AudioStream } from "../../../../plocs/media_files/models";

type Props = {
    audios: AudioStream[],
    audioId?: string,
    onAudioChange: (audioId: string) => void,
};

export const AudioSelection = ({ audioId, audios, onAudioChange }: Props) => {
    return (
        <FormControl>
        <InputLabel id="audio-id-select-label">Audio</InputLabel>
        <Select
            labelId="audio-id-select-label"
            id="audio-id-select"
            value={audioId}
            label="Audio"
            onChange={event => onAudioChange(event.target.value)}
            disabled={audios.length <= 1}
        >
            {
                audios.map(audio => (
                    <MenuItem
                    key={audio.AudioID}
                    value={audio.AudioID}
                    >
                    {`${audio.Title} (${audio.Language})`}
                    </MenuItem>
                ))
            }
        </Select>
        </FormControl>
    );
}
