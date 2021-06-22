<script lang="ts">
  import Drawer, { Content, Header, Title, Scrim } from '@smui/drawer/styled';
  import List, { Item, Text, Graphic } from '@smui/list/styled';

  import { navigateToMovies, navigateToPlaybackHistory, navigateToPlaylist, Routes } from '../functions/routing';
  import type { MenuItem } from '../models/drawer';
  import { drawerStore } from '../stores/drawer';
  import { routingStore } from '../stores/routing';

  let menuDrawer: Drawer;

  const createNavigateHandler = (routingHandler: () => void) => {
    return () => {
      routingHandler();
      drawerStore.set({ open: false });
    };
  };

  const menuItems: MenuItem[] = [
    {
      route: Routes.Movies,
      text: 'Movies',
      graphic: 'movie',
      handler: createNavigateHandler(navigateToMovies),
    },
    {
      route: Routes.PlaybackHistory,
      text: 'Playback history',
      graphic: 'history',
      handler: createNavigateHandler(navigateToPlaybackHistory),
    },
    {
      route: Routes.Playlist,
      text: 'Playlist',
      graphic: 'playlist-play',
      handler: createNavigateHandler(navigateToPlaylist),
    }
  ];

</script>

<Drawer variant="modal" bind:this={menuDrawer} bind:open={$drawerStore.open}>
  <Header>
    <Title>MPV web</Title>
  </Header>
  <Content>
    <List>
      {#each menuItems as menuItem}
        <Item on:SMUI:action={menuItem.handler} activated={$routingStore.route === menuItem.route} selected={$routingStore.route === menuItem.route}>
          <Graphic class="material-icons" aria-hidden="true">{menuItem.graphic}</Graphic>
          <Text>{menuItem.text}</Text>
        </Item>
      {/each}
    </List>
  </Content>
</Drawer>
<Scrim/>
