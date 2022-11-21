import { AnyAction } from "redux"
import { MediaFilesMap } from "../../../../domains/media_files/entities";
import { mediaFilesFetched, mediaFilesFetchError } from "./actions";
import { MediaFile } from "./models";

// const stubbedMediaFiles: MediaFile[] = [...Array(10000)].map((_, idx) => {
//   return {
//     Title: `title ${idx}`,
//     FormatLongName: '',
//     FormatName: '',
//     Duration: 5,
//     Path: `/root/${idx}`,
//     VideoStreams: [],
//     AudioStreams: [],
//     SubtitleStreams: [],
//     Chapters: [],
//   };
// });

type State = {
  mediaFiles: MediaFilesMap,
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

  return state;
}
