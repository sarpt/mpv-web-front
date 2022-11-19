import { styled } from "@mui/material";
import useSize from "@react-hook/size";
import { useState } from "react";
import { useSelector } from "react-redux";
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

  const mediaFiles = useSelector(selectMediaFiles);

  return (
    <PageBase>
      <ListContainer ref={node => node && setParentRef(node)}>
        <MediaFilesList mediaFiles={mediaFiles} width={width} height={height} />
      </ListContainer>
    </PageBase>
  );
};
