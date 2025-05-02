import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { MediaFilesPage } from "ui/pages/media_files/MediaFilesPage";
import { PlaylistsPage } from "ui/pages/playlists/PlaylistsPage";
import { AppLayout } from "ui/common/layouts/AppLayout";
import { Routes } from "ui/common/components/App/models/routes";
import { HomePage } from "ui/pages/home/HomePage";

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
