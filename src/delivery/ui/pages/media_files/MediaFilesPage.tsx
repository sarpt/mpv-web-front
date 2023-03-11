import { styled } from "@mui/material";
import useSize from "@react-hook/size";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToMediaFiles, unsubscribeToMediaFiles } from "../../plocs/media_files/actions";
import { MediaFile } from "../../plocs/media_files/models";
import { selectMediaFiles } from "../../plocs/media_files/selectors";
import { playMediaFile } from "../../plocs/playback/actions";
import { selectMediaFilePath } from "../../plocs/playback/selectors";
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

  const dispatch = useDispatch();

  const mediaFiles = useSelector(selectMediaFiles);
  const playbackMediaFilePath = useSelector(selectMediaFilePath);

  useEffect(() => {
    dispatch(subscribeToMediaFiles());

    return () => {
      dispatch(unsubscribeToMediaFiles());
    };
  }, []);

  const onMediaFileSelected = useCallback((mediaFile: MediaFile) => {
    dispatch(playMediaFile(mediaFile.Path));
  }, []);

  const currentMediaFile = useMemo(() => {
    if (!playbackMediaFilePath) return undefined;

    return mediaFiles[playbackMediaFilePath];
  }, [playbackMediaFilePath, mediaFiles]);

  return (
    <PageBase>
      <ListContainer ref={node => node && setParentRef(node)}>
        <List
          currentMediaFile={currentMediaFile}
          mediaFiles={[...Object.values(mediaFiles)]}
          width={width}
          height={height}
          onMediaFileSelected={onMediaFileSelected}
        />
      </ListContainer>
    </PageBase>
  );
};
