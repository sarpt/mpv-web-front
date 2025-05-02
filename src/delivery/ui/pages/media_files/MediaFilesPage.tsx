import { styled } from "@mui/material";
import useSize from "@react-hook/size";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { subscribeToMediaFiles, unsubscribeToMediaFiles } from "ui/plocs/media_files/actions";
import { selectMediaFiles } from "ui/plocs/media_files/selectors";
import { playMediaFile } from "ui/plocs/playback/actions";
import { selectLoopVariant, selectMediaFilePath } from "ui/plocs/playback/selectors";
import { MediaFilePlayDialog } from "ui/pages/playback/components/MediaFilePlayDialog";
import { MediaFile } from "src/domains/media_files/entities";
import { selectConnected } from "ui/plocs/connection/selectors";

import { List } from "./components/List";

const PageBase = styled('div')`
  height: 100%;
  width: 100%;
  padding: 10px;
`;

const ListContainer = styled('div')`
  overflow-y: hidden;
  overflow-x: auto;
  height: 100%;
  width: 100%;
`;

export const MediaFilesPage = () => {
  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);
  const [width, height] = useSize(parentRef);
  const [playbackOptionsDialogOpen, setPlaybackOptionsDialogOpen] = useState(false);
  const [selectedMediaFile, setSelectedMediaFile] = useState<MediaFile | undefined>(undefined);

  const dispatch = useDispatch();

  const mediaFiles = useSelector(selectMediaFiles);
  const playbackMediaFilePath = useSelector(selectMediaFilePath);
  const currentLoopVariant = useSelector(selectLoopVariant);
  const connected = useSelector(selectConnected);

  useEffect(() => {
    if (!connected) return;

    dispatch(subscribeToMediaFiles());

    return () => {
      dispatch(unsubscribeToMediaFiles());
    };
  }, [connected, dispatch]);

  const onMediaFileClicked = useCallback((mediaFile: MediaFile) => {
    setSelectedMediaFile(mediaFile);
    setPlaybackOptionsDialogOpen(true);
  }, [setSelectedMediaFile, setPlaybackOptionsDialogOpen]);

  const currentMediaFile = useMemo(() => {
    if (!playbackMediaFilePath) return undefined;

    return mediaFiles[playbackMediaFilePath];
  }, [playbackMediaFilePath, mediaFiles]);

  const handlePlayDialogOk = useCallback(() => {
    setPlaybackOptionsDialogOpen(false);

    if (!selectedMediaFile) return;

    dispatch(playMediaFile(selectedMediaFile.Path)); // TODO: modify this action
  }, [dispatch, selectedMediaFile]);

  return (
    <PageBase>
      <ListContainer ref={node => node && setParentRef(node)}>
        <List
          currentMediaFile={currentMediaFile}
          mediaFiles={[...Object.values(mediaFiles)]}
          width={width}
          height={height}
          onMediaFileSelected={onMediaFileClicked} />
      </ListContainer>
      <MediaFilePlayDialog
        onOk={handlePlayDialogOk}
        mediaFile={selectedMediaFile}
        currentLoopVariant={currentLoopVariant}
        open={playbackOptionsDialogOpen}
        onClose={() => setPlaybackOptionsDialogOpen(false)}
      />
    </PageBase>
  );
};
