import { AnyAction } from "redux"

import { Playback } from "src/domains/playback/entities";

import { playbackFetched, playbackFetchError } from "./actions";

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
