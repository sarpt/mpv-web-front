import { useCallback } from "react";

import { EntryRendererProps, VirtualList } from "../../../common/components/VirtualList";
import { MediaFile } from "../../../plocs/media_files/models";
import { Item } from "./Item";

type Props = {
  currentMediaFile?: MediaFile, 
  mediaFiles: MediaFile[],
  onMediaFileSelected: (mediaFile: MediaFile) => void,
  width: number,
  height: number, 
};

const rowSize = 48;

export const List = ({ mediaFiles, height, width, onMediaFileSelected, currentMediaFile }: Props) => {
  const entryRenderer = useCallback((props: EntryRendererProps<MediaFile>) => {
    return <Item selected={currentMediaFile?.Path === props.entry.Path} {...props} />;
  }, [currentMediaFile?.Path]);

  return (
    <VirtualList
      width={width}
      height={height}
      data={mediaFiles}
      rowSize={rowSize}
      entryRenderer={entryRenderer}
      onSelected={onMediaFileSelected}
    />
  );
};
