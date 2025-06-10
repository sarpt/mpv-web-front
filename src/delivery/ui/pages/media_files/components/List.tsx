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

const rowSizePx = 42;

export const List = ({ mediaFiles, height, width, onMediaFileSelected, currentMediaFile }: Props) => {
  const focusedPath = useSelector(selectFocusedPath);
  const focusRequestId = useSelector(selectFocusRequestId);

  const focusedEntryIdx = useMemo(() => {
    if (!focusedPath) return undefined;
  
    const idx = mediaFiles.findIndex(mf => mf.Path === focusedPath);
    return idx !== -1 ? idx : undefined;
  }, [mediaFiles, focusedPath]);

  const entryRenderer = useCallback((props: EntryRendererProps<MediaFile>) => {
    return <Item
      focused={focusedPath === props.entry.Path}
      selected={currentMediaFile?.Path === props.entry.Path}
      rowSizePx={rowSizePx}
      {...props}
    />;
  }, [focusedPath, currentMediaFile?.Path]);

  return (
    <VirtualList
      focusedIdx={focusedEntryIdx}
      focusRequestId={focusRequestId}
      width={width}
      height={height}
      data={mediaFiles}
      rowSize={rowSizePx}
      entryRenderer={entryRenderer}
      onSelected={onMediaFileSelected}
    />
  );
};
