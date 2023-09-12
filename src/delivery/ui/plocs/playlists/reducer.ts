import { AnyAction } from "redux"
import { PlaylistsMap } from "./models";
import { playlistsFetchError, playlistsFetched } from "./actions";

type State = {
  playlists: PlaylistsMap,
  errMsg?: string,
};

const initialState: State = {
  playlists: {},
};

export default function playlistsReducer(state = initialState, action: AnyAction): State {
  if (playlistsFetched.match(action)) {
    return {
      ...state,
      playlists: action.payload.playlists,
    };
  }


  if (playlistsFetchError.match(action)) {
    return {
      ...state,
      errMsg: action.payload.errMsg,
    };
  }

  return state;
}
