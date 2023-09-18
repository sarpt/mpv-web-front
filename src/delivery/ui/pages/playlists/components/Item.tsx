import { styled } from "@mui/material";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import { Playlist } from "../../../plocs/playlists/models";
import { useMemo } from "react";

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

export type Props = { entry: Playlist, idx: number, selected?: boolean };

const defaultDescription = "No description provided";

export const Item = ({ idx, entry, selected }: Props) => {
  let Row = idx % 2 ? OddRow : EvenRow;
  if (selected) Row = PlayingRow;

  const description = useMemo(() => {
    if (!entry.Description) return defaultDescription;

    return entry.Description;
  }, [entry.Description])

  return (
    <Row key={idx} disablePadding>
      <ListItemButton>
        <ListItemText primary={<span>{entry.Name}</span>} secondary={<span>{description}</span>} />
      </ListItemButton>
    </Row>
  );
};