import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { SubtitleStream } from "../../../../plocs/media_files/models";

type Props = {
    subtitleId?: string,
    subtitles: SubtitleStream[],
    onSubtitleChange: (subtitleId: string) => void,
};

export const SubtitlesSelection = ({ subtitles, subtitleId, onSubtitleChange }: Props) => {
    return (
        <FormControl>
        <InputLabel id="subtitle-id-select-label">Subtitles</InputLabel>
        <Select
            labelId="subtitles-id-select-label"
            id="subtitles-id-select"
            value={subtitleId}
            label="Subtitles"
            onChange={event => onSubtitleChange(event.target.value)}
            disabled={subtitles.length <= 1}
        >
            {
                subtitles.map(subtitle => (
                    <MenuItem
                    key={subtitle.SubtitleID}
                    value={subtitle.SubtitleID}
                    >
                    {`${subtitle.Title} (${subtitle.Language})`}
                    </MenuItem>
                ))
            }
        </Select>
        </FormControl>
    );
};
