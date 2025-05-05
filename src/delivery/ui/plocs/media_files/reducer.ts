import { AnyAction } from "redux"
import { MediaFilesMap } from "../../../../domains/media_files/entities";
import { focusOnMediaFile, mediaFilesFetched, mediaFilesFetchError } from "./actions";

type State = {
  mediaFiles: MediaFilesMap,
  focuedPath?: string,
  focusRequestId?: number,
  errMsg?: string,
};

const initialState: State = {
  mediaFiles: {},
};

export default function mediaFilesReducer(state = initialState, action: AnyAction): State {
  if (mediaFilesFetched.match(action)) {
    return {
      ...state,
      mediaFiles: action.payload.mediaFiles,
    };
  }


  if (mediaFilesFetchError.match(action)) {
    return {
      ...state,
      errMsg: action.payload.errMsg,
    };
  }

  if (focusOnMediaFile.match(action)) {
    return {
      ...state,
      focuedPath: action.payload.path,
      focusRequestId: Date.now(),
    };
  }

  return state;
}
