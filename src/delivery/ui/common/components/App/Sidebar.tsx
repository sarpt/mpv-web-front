import Drawer from "@mui/material/Drawer";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from '@mui/icons-material/InboxOutlined'
import MailIcon from '@mui/icons-material/MailOutlined'
import { Routes } from "./models/routes";

type Props = {
  open: boolean,
  changeOpen: (open: boolean) => void
};

const navigationEntries = [
  {
    title: 'Mediafiles',
    icon: <InboxIcon />,
    route: Routes.MediaFiles,
  },
  {
    title: 'Playlists',
    icon: <MailIcon />,
    route: Routes.Playlists
  }
];

export const AppSidebar = ({
  open,
  changeOpen
}: Props) => {
    return (
      <Drawer
        anchor='left'
        open={open}
        onClose={() => changeOpen(false)}
      >
        <List>
          {navigationEntries.map(entry => {
            return (
              <ListItem key={entry.title} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {entry.icon}
                  </ListItemIcon>
                  <ListItemText primary={
                    <Link to={entry.route}>{entry.title}</Link>
                  } />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    );
};
