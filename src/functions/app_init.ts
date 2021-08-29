import { getMediaFilesSse, getPlaybackSse, getPlaylistSse, getStatusSse, init as initSse } from '../functions/sse';
import { mediaFilesStore } from '../stores/media_files';
import { playbackStore } from '../stores/playback';
import { apiConnectionStore } from '../stores/api_connection';

import { initPlaybackHistoryWatch } from './playback_history';
import { playlistsStore } from '../stores/playlists';

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

  getMediaFilesSse().subscribe(
    mediaFiles => {
      mediaFilesStore.update(state => {
        return {
          mediaFiles: {
            ...state.mediaFiles,
            ...mediaFiles,
          },
          isFetchingInProgress: false,
        };
      });
    },
  );

  initSse();
}
