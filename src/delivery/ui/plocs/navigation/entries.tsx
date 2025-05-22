import InboxIcon from '@mui/icons-material/InboxOutlined';
import MailIcon from '@mui/icons-material/MailOutlined';

import { Routes } from 'ui/plocs/navigation/models';

export const navigationEntries = {
  MediaFiles: {
    title: 'Mediafiles',
    icon: <InboxIcon />,
    route: Routes.MediaFiles,
  },
  Playlists: {
    title: 'Playlists',
    icon: <MailIcon />,
    route: Routes.Playlists
  }
} as const;
