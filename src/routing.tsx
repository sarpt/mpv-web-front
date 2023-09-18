import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { MediaFilesPage } from "./delivery/ui/pages/media_files/MediaFilesPage";
import { PlaylistsPage } from "./delivery/ui/pages/playlists/PlaylistsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MediaFilesPage />,
  },
  {
    path: "/playlists",
    element: <PlaylistsPage />,
  },
]);

export const Routing = () => {
    return (
        <RouterProvider router={router} />
    );
};
