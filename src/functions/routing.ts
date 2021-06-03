import page from 'page';

export enum Routes {
  Root = '/',
  ApiAddress = '/api-address',
  Movies = '/movies',
  PlaybackHistory = '/playback-history',
}

type Handler = () => void;

type Routing = {
  [Routes.Root]: Handler,
  [Routes.Movies]: Handler,
  [Routes.PlaybackHistory]: Handler,
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

export function navigateToApiAddress() {
  page(Routes.ApiAddress);
}
