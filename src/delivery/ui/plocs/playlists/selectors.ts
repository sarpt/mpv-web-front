import { createSelectorCreator, lruMemoize } from 'reselect';
import { createSelector } from "@reduxjs/toolkit"

import { PlaylistsMap } from 'src/domains/playlists/entities';

import { selectStoreState } from "../../reducers";

const selectPlaylistsState = createSelector(selectStoreState, (state) => state.playlists);

const getPlaylistsListIdentity = (playlists: PlaylistsMap) => Object.keys(playlists).join(';');
const createPlaylistsSelector = createSelectorCreator(
  lruMemoize,
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
