import { styled } from "@mui/material";
import useSize from "@react-hook/size";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMediaFiles } from "../../plocs/media_files/actions";
import { selectMediaFiles } from "../../plocs/media_files/selectors";
import { MediaFilesList } from "./components/MediaFilesList";

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
  useEffect(() => {
    dispatch(fetchMediaFiles());
  }, []);

  return (
    <PageBase>
      <ListContainer ref={node => node && setParentRef(node)}>
        <MediaFilesList mediaFiles={[...Object.values(mediaFiles)]} width={width} height={height} />
      </ListContainer>
    </PageBase>
  );
};
