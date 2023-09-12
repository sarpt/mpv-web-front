import { createSelectorCreator, defaultMemoize } from 'reselect';
import { createSelector } from "@reduxjs/toolkit"
import { selectStoreState } from "../../reducers";
import { PlaylistsMap } from './models';

const selectPlaylistsState = createSelector(selectStoreState, (state) => state.playlists);

const getPlaylistsListIdentity = (playlists: PlaylistsMap) => Object.keys(playlists).join(';');
const createPlaylistsSelector = createSelectorCreator(
  defaultMemoize,
  (a: PlaylistsMap, b: PlaylistsMap): boolean => {
    return getPlaylistsListIdentity(a) === getPlaylistsListIdentity(b)
  }
)

const selectPlaylistsList = createSelector(
  selectPlaylistsState,
  (state) => state.playlists
);

export const selectPlaylists = createPlaylistsSelector(
  selectPlaylistsList,
  (playlistsMap) => playlistsMap,
);
