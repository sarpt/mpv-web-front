import { styled } from "@mui/material";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import ListItemText from "@mui/material/ListItemText/ListItemText";

import { MediaFile } from "src/domains/media_files/entities";

const PlayingRow = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const EvenRow = styled(ListItem)`
  background-color: rgb(255, 255, 255);
`;

const OddRow = styled(ListItem)`
  background-color: rgb(220, 220, 220);
`;

export type Props = { entry: MediaFile, idx: number, selected?: boolean };

export const Item = ({ idx, entry, selected }: Props) => {
  let Row = idx % 2 ? OddRow : EvenRow;
  if (selected) Row = PlayingRow;

  return (
    <Row key={idx} disablePadding>
      <ListItemButton>
        <ListItemText primary={<span>{entry.Path}</span>} />
      </ListItemButton>
    </Row>
  );
};
