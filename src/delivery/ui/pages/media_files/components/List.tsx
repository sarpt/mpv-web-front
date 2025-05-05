import { useCallback, useMemo } from "react";

import { EntryRendererProps, VirtualList } from "ui/common/components/VirtualList";
import { MediaFile } from "src/domains/media_files/entities";

import { Item } from "./Item";
import { useSelector } from "react-redux";
import { selectFocusedPath, selectFocusRequestId } from "ui/plocs/media_files/selectors";

type Props = {
  currentMediaFile?: MediaFile, 
  mediaFiles: MediaFile[],
  onMediaFileSelected: (mediaFile: MediaFile) => void,
  width: number,
  height: number, 
};

const rowSize = 48;

export const List = ({ mediaFiles, height, width, onMediaFileSelected, currentMediaFile }: Props) => {
  const focusedPath = useSelector(selectFocusedPath);
  const focusRequestId = useSelector(selectFocusRequestId);
  const entryRenderer = useCallback((props: EntryRendererProps<MediaFile>) => {
    return <Item selected={currentMediaFile?.Path === props.entry.Path} {...props} />;
  }, [currentMediaFile?.Path]);

  const focusedEntryIdx = useMemo(() => {
    if (!focusedPath) return undefined;
  
    const idx = mediaFiles.findIndex(mf => mf.Path === focusedPath);
    return idx !== -1 ? idx : undefined;
  }, [mediaFiles, focusedPath]);

  return (
    <VirtualList
      focusedIdx={focusedEntryIdx}
      focusRequestId={focusRequestId}
      width={width}
      height={height}
      data={mediaFiles}
      rowSize={rowSize}
      entryRenderer={entryRenderer}
      onSelected={onMediaFileSelected}
    />
  );
};
