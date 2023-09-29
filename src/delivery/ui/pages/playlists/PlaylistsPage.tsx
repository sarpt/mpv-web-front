import { styled } from "@mui/material";
import useSize from "@react-hook/size";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List } from "./components/List";
import { Playlist } from "../../plocs/playlists/models";
import { selectPlaylists } from "../../plocs/playlists/selectors";
import { useSelectedPlaylist } from "../../plocs/playlists/hooks/useSelectedPlaylist";
import { subscribeToPlaylists, unsubscribeToPlaylists } from "../../plocs/playlists/actions";
import { loadPlaylist } from "../../plocs/playback/actions";

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
  }, []);

  const onPlaylistSelected = useCallback((playlist: Playlist) => {
    dispatch(loadPlaylist(playlist.UUID));
  }, []);

  return (
    <PageBase>
      <ListContainer ref={node => node && setParentRef(node)}>
        <List
          currentPlaylist={currentPlaylist}
          playlists={[...Object.values(playlists)]}
          width={width}
          height={height}
          onPlaylistSelected={onPlaylistSelected}
        />
      </ListContainer>
    </PageBase>
  );
};
