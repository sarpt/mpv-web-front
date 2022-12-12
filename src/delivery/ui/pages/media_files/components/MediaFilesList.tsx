import { styled } from "@mui/material";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import ListItemText from "@mui/material/ListItemText/ListItemText";

import { VirtualList } from "../../../common/components/VirtualList";
import { MediaFile } from "../../../plocs/media_files/models";

type Props = {
  mediaFiles: MediaFile[],
  onMediaFileSelected: (mediaFile: MediaFile) => void,
  width: number,
  height: number, 
};

const EvenRow = styled(ListItem)`
  background-color: rgb(255, 255, 255);
`;

const OddRow = styled(ListItem)`
  background-color: rgb(220, 220, 220);
`;

const rowSize = 48;

const ItemRender = (props: { entry: MediaFile, idx: number }) => {
  const Row = props.idx % 2 ? OddRow : EvenRow;

  return (
    <div>
      <Row key={props.idx} disablePadding>
        <ListItemButton>
          <ListItemText primary={<span>{props.entry.Path}</span>} />
        </ListItemButton>
      </Row>
    </div>
  );
};

export const MediaFilesList = ({ mediaFiles, height, width, onMediaFileSelected }: Props) => {
  return (
    <VirtualList
      width={width}
      height={height}
      data={mediaFiles}
      rowSize={rowSize}
      entryRenderer={ItemRender}
      onSelected={onMediaFileSelected}
    />
  );
};
