import { AnyAction } from "redux"
import { MediaFilesMap } from "../../../../domains/media_files/entities";
import { focusOnMediaFile, mediaFilesAdded, mediaFilesFetched, mediaFilesFetchError, mediaFilesRemoved } from "./actions";

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

  if (mediaFilesAdded.match(action)) {
    const mediaFiles = {
      ...state.mediaFiles,
      ...action.payload.added,
    };

    return {
      ...state,
      mediaFiles,
    };
  }

  if (mediaFilesRemoved.match(action)) {
    const mediaFiles: MediaFilesMap = {};

    for (const [path, mf] of Object.entries(state.mediaFiles)) {
      if (!action.payload.removed[path]) mediaFiles[path] = mf;
    }
    
    return {
      ...state,
      mediaFiles,
    };
  }

  return state;
}
