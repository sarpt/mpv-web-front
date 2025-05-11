import Drawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from '@mui/icons-material/InboxOutlined'
import MailIcon from '@mui/icons-material/MailOutlined'
import { Routes } from "./models/routes";
import { useCallback } from "react";

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
    const navigate = useNavigate();
    
    const onListItemClick = useCallback((entry: { route: Routes }) => {
      navigate(entry.route);
      changeOpen(false);
    }, [changeOpen, navigate]);

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
                <ListItemButton onClick={() => onListItemClick(entry)}>
                  <ListItemIcon>
                    {entry.icon}
                  </ListItemIcon>
                  <ListItemText primary={entry.title} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    );
};
