<script lang="ts">
  import Drawer, { Content, Header, Title, Scrim } from '@smui/drawer';
  import List, { Item, Text, Graphic } from '@smui/list';

  import { navigateToMovies, navigateToPlaybackHistory, Routes } from '../functions/routing';
  import type { MenuItem } from '../models/drawer';
  import { drawerStore } from '../stores/drawer';
  import { routingStore } from '../stores/routing';

  let menuDrawer: Drawer;

  const onMoviesClick = () => navigateToMovies();
  const onHistoryClick = () => navigateToPlaybackHistory();

  const menuItems: MenuItem[] = [
    {
      route: Routes.Movies,
      text: 'Movies',
      graphic: 'movie',
      handler: onMoviesClick,
    },
    {
      route: Routes.PlaybackHistory,
      text: 'Playback history',
      graphic: 'history',
      handler: onHistoryClick,
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
