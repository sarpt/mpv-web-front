import { mediaFilesStore } from '../stores/media_files';
import { playbackStore } from '../stores/playback';
import { apiConnectionStore } from '../stores/api_connection';

import { initPlaybackHistoryWatch } from './playback_history';
import { playlistsStore } from '../stores/playlists';
import { filter } from 'rxjs/operators';
import type { MediaFilesMap } from '../models/api';
import { getMediaFilesSse, MediaFilesEvents } from './sse/media_files';
import { getPlaybackSse } from './sse/playback';
import { getPlaylistSse } from './sse/playlists';
import { getStatusSse } from './sse/status';
import { init as initSse } from './sse/initialization';

export function appInit() {
  initPlaybackHistoryWatch();

  getPlaybackSse().subscribe(
    playback => {
      playbackStore.set({
        playback,
      });
    },
  );

  getPlaylistSse().subscribe(
    playlists => {
      playlistsStore.set(playlists);
    },
  );

  getStatusSse().subscribe({
    next: () => {
      apiConnectionStore.update(state => {
        if (state.connected) {
          return state;
        }

        return {
          connected: true,
        };
      });
    },
    error: () => {
      apiConnectionStore.set({
        connected: false,
      });
    },
  });

  getMediaFilesSse()
    .pipe(
      filter(action => action.event === MediaFilesEvents.Added),
    )
    .subscribe(
      action => {
        mediaFilesStore.update(state => {
          return {
            mediaFiles: {
              ...state.mediaFiles,
              ...action.items,
            },
            isFetchingInProgress: false,
          };
        });
      },
    );

  getMediaFilesSse()
    .pipe(
      filter(action => action.event === MediaFilesEvents.Removed),
    )
    .subscribe(
      action => {
        mediaFilesStore.update(state => {
          const filteredMediaFiles: MediaFilesMap = {};
          for (const path in state.mediaFiles) {
            if (!!action.items[path]) continue;

            Object.assign(filteredMediaFiles, { [path]: state.mediaFiles[path] });
          }

          return {
            mediaFiles: {
              ...filteredMediaFiles,
            },
            isFetchingInProgress: false,
          };
        });
      },
    );
  initSse();
}
