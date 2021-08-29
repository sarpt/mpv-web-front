import page from 'page';

export enum Routes {
  Root = '/',
  MediaFiles = '/media-files',
  PlaybackHistory = '/playback-history',
  Playlist = '/playlist',
}

type Handler = () => void;

type Routing = {
  [key in Routes]: Handler
};

export function initRouter(routes: Routing) {
  for (const [path, handler] of Object.entries(routes)) {
    page(path, handler);
  }

  page.start();
}

export function navigateToRoot() {
  page(Routes.Root);
}

export function navigateToMediaFiles() {
  page(Routes.MediaFiles);
}

export function navigateToPlaybackHistory() {
  page(Routes.PlaybackHistory);
}

export function navigateToPlaylist() {
  page(Routes.Playlist);
}
