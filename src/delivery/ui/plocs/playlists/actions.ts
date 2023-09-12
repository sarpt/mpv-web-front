import { createAction } from "@reduxjs/toolkit";
import { PlaylistsMap } from "./models";

enum PlaylistsActions {
  FetchPlaylists = 'FetchPlaylists',
  PlaylistsFetched = 'PlaylistsFetched',
  PlaylistsFetchError = 'PlaylistsFetchError',
  SubscribeToPlaylists = 'SubscribeToPlaylists',
  UnsubscribeToPlaylists = 'UnsubscribeToPlaylists',
}

export const fetchPlaylists = createAction(PlaylistsActions.FetchPlaylists);

export const subscribeToPlaylists = createAction(PlaylistsActions.SubscribeToPlaylists);

export const unsubscribeToPlaylists = createAction(PlaylistsActions.UnsubscribeToPlaylists);

export const playlistsFetched = createAction(PlaylistsActions.PlaylistsFetched, (playlists: PlaylistsMap) => {
  return {
    payload: {
      playlists,
    },
  };
});

export const playlistsFetchError = createAction(PlaylistsActions.PlaylistsFetchError, (errMsg: string) => {
  return {
    payload: {
      errMsg,
    },
  };
});
