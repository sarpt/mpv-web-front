import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { MediaFilesPage } from "ui/pages/media_files/MediaFilesPage";
import { PlaylistsPage } from "ui/pages/playlists/PlaylistsPage";
import { AppLayout } from "ui/common/layouts/AppLayout";
import { HomePage } from "ui/pages/home/HomePage";
import { Routes } from "ui/plocs/navigation/models";

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: Routes.MediaFiles,
        element: <MediaFilesPage />,
      },
      {
        path: Routes.Playlists,
        element: <PlaylistsPage />,
      },
      {
        path: '/',
        element: <HomePage />,
      }
    ]
  }
]);

export const Routing = () => {
    return (
        <RouterProvider router={router} />
    );
};
