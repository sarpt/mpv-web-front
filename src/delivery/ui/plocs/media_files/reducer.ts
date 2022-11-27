import { AnyAction } from "redux"
import { MediaFilesMap } from "../../../../domains/media_files/entities";
import { mediaFilesAdded, mediaFilesFetchError, mediaFilesRemoved } from "./actions";

type State = {
  mediaFiles: MediaFilesMap,
  errMsg?: string,
};

const initialState: State = {
  mediaFiles: {},
};

export default function mediaFilesReducer(state = initialState, action: AnyAction): State {
  if (mediaFilesAdded.match(action)) {
    return {
      ...state,
      mediaFiles: {
        ...state.mediaFiles,
        ...action.payload.mediaFiles,
      }
    };
  }

  if (mediaFilesRemoved.match(action)) {
    const changedMediaFiles: MediaFilesMap = {};

    for (const path in state.mediaFiles) {
      if (!!action.payload.mediaFiles[path]) continue;

      Object.assign(changedMediaFiles, { [path]: state.mediaFiles[path] });
    }

    return {
      ...state,
      mediaFiles: changedMediaFiles, 
    };
  }

  if (mediaFilesFetchError.match(action)) {
    return {
      ...state,
      errMsg: action.payload.errMsg,
    };
  }

  return state;
}
