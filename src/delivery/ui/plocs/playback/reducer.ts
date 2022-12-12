import { AnyAction } from "redux"
import { playbackFetched, playbackFetchError } from "./actions";
import { Playback } from "./models";

type State = {
  playback?: Playback,
  errMsg?: string,
};

const initialState: State = {};

export default function playbackReducer(state = initialState, action: AnyAction): State {
  if (playbackFetched.match(action)) {
    return {
      ...state,
      playback: action.payload.playback,
    };
  }

  if (playbackFetchError.match(action)) {
    return {
      ...state,
      errMsg: action.payload.errMsg,
    };
  }

  return state;
}
