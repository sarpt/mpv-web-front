import { useCallback } from "react";

import { EntryRendererProps, VirtualList } from "ui/common/components/VirtualList";
import { MediaFile } from "src/domains/media_files/entities";

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
