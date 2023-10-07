import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { MediaFilesPage } from "./delivery/ui/pages/media_files/MediaFilesPage";
import { PlaylistsPage } from "./delivery/ui/pages/playlists/PlaylistsPage";
import { AppLayout } from "./delivery/ui/common/layouts/AppLayout";
import { Routes } from "./delivery/ui/common/components/App/models/routes";

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
        element: <MediaFilesPage />,
      }
    ]
  }
]);

export const Routing = () => {
    return (
        <RouterProvider router={router} />
    );
};
