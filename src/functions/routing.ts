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

export const Navigation = new Map<Routes, () => void>([
  [
    Routes.Root,
    () => page(Routes.Root),
  ],
  [
    Routes.MediaFiles,
    () => page(Routes.MediaFiles),
  ],
  [
    Routes.PlaybackHistory,
    () => page(Routes.PlaybackHistory)
  ],
  [
    Routes.Playlist,
    () => page(Routes.Playlist)
  ]
]);
