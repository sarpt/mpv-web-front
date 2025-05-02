import { styled } from "@mui/material";
import useSize from "@react-hook/size";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectPlaylists } from "ui/plocs/playlists/selectors";
import { useSelectedPlaylist } from "ui/plocs/playlists/hooks/useSelectedPlaylist";
import { subscribeToPlaylists, unsubscribeToPlaylists } from "ui/plocs/playlists/actions";
import { loadPlaylist } from "ui/plocs/playback/actions";
import { Playlist } from "src/domains/playlists/entities";

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

export const PlaylistsPage = () => {
  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);
  const [width, height] = useSize(parentRef);

  const dispatch = useDispatch();
  const currentPlaylist = useSelectedPlaylist();

  const playlists = useSelector(selectPlaylists);

  useEffect(() => {
    dispatch(subscribeToPlaylists());

    return () => {
      dispatch(unsubscribeToPlaylists());
    };
  }, [dispatch]);

  const onPlaylistSelected = useCallback((playlist: Playlist) => {
    dispatch(loadPlaylist(playlist.UUID));
  }, [dispatch]);

  return (
    <PageBase>
      <ListContainer ref={node => node && setParentRef(node)}>
        <List
          currentPlaylist={currentPlaylist}
          playlists={[...Object.values<Playlist>(playlists)]}
          width={width}
          height={height}
          onPlaylistSelected={onPlaylistSelected}
        />
      </ListContainer>
    </PageBase>
  );
};
