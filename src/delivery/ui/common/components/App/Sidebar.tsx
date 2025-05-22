import { useCallback } from "react"
import Drawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { navigationEntries } from "ui/plocs/navigation/entries";
import { Routes } from "ui/plocs/navigation/models";

type Props = {
  open: boolean,
  changeOpen: (open: boolean) => void
};

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
          {Object.values(navigationEntries).map(entry => {
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
