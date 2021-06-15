import page from 'page';

export enum Routes {
  Root = '/',
  Movies = '/movies',
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

export function navigateToMovies() {
  page(Routes.Movies);
}

export function navigateToPlaybackHistory() {
  page(Routes.PlaybackHistory);
}

export function navigateToPlaylist() {
  page(Routes.Playlist);
}
