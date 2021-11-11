<script lang="ts">
  import {
    List,
    ListItem,
    NavigationDrawer
  } from "smelte";

  import { Navigation, Routes } from '../functions/routing';
  import type { MenuItem } from '../models/drawer';
  import { drawerStore } from '../stores/drawer';
  import { routingStore } from '../stores/routing';

  const navigate = (route: string | undefined) => {
    if (!route) return;

    const handler = Navigation.get(route as Routes);
    if (!handler) return;

    handler();
    drawerStore.set({ open: false });
  };

  const menuItems: MenuItem[] = [
    {
      to: Routes.MediaFiles,
      text: 'Media files',
      icon: 'movie',
    },
    {
      to: Routes.PlaybackHistory,
      text: 'Playback history',
      icon: 'history',
    },
    {
      to: Routes.Playlist,
      text: 'Playlist',
      icon: 'playlist_play',
    }
  ];

</script>

<NavigationDrawer
  bind:show={$drawerStore.open}
  persistent={false}
  elevation={true}
  classes={(ec) => ec.replace('md:mt-16', 'md:mt-0')}
>
  <h6
    class="p-6 ml-1 pb-2 text-xs text-gray-900"
  >MPV Web</h6>
  <List
    items={menuItems}
  >
    <span slot="item" let:item={item} class="cursor-pointer">
      <ListItem
        selected={$routingStore.route === item.to}
        {...item}
        dense
        on:click={() => navigate(item.to)}
      />
    </span>
  </List>
<hr>
</NavigationDrawer>
