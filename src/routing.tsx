import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { MediaFilesPage } from "./delivery/ui/pages/media_files/MediaFilesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MediaFilesPage />,
  },
]);

export const Routing = () => {
    return (
        <RouterProvider router={router} />
    );
};
