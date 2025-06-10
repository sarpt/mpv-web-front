import { styled } from "@mui/material";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import ListItemText from "@mui/material/ListItemText/ListItemText";

import { MediaFile } from "src/domains/media_files/entities";
import { PlaybackPath } from "ui/common/components/PlaybackPath";

const borderSizePx = 3;

type Props = {
  entry: MediaFile,
  idx: number,
  selected: boolean,
  focused: boolean,
  rowSizePx: number,
};

export const Item = ({ idx, entry, selected, focused, rowSizePx }: Props) => {
  let Row = idx % 2 ? OddRow : EvenRow;
  if (selected) Row = PlayingRow;

  return (
    <Row focused={focused} key={idx} disablePadding>
      <ListItemButton style={{ height: `${rowSizePx - 2 * borderSizePx}px` }}>
        <ListItemText primary={<PlaybackPath path={entry.Path}/>} />
      </ListItemButton>
    </Row>
  );
};

const CommonRow = styled(ListItem)<{ focused: boolean }>`
  height: 42px;
  border: ${borderSizePx}px;
  border-style: solid;
  border-color: ${props => props.focused ? '#42f389' : 'transparent'};
`;

const PlayingRow = styled(CommonRow)`
  background-color: ${props => props.theme.palette.primary.main};
  color: ${props => props.theme.palette.primary.contrastText};
`;

const EvenRow = styled(CommonRow)`
  background-color: rgb(255, 255, 255);
`;

const OddRow = styled(CommonRow)`
  background-color: rgb(220, 220, 220);
`;