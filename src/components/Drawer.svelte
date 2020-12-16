<script lang="ts">
  import Drawer, { Content, Header, Title, Scrim } from '@smui/drawer';
  import List, { Item, Text, Graphic } from '@smui/list';

  import { navigateToMovies, navigateToPlaybackHistory } from '../functions/routing';
  import { drawerStore } from '../stores/drawer';

  let menuDrawer: Drawer;

  const onMoviesClick = () => navigateToMovies()
  const onHistoryClick = () => navigateToPlaybackHistory()
</script>

<Drawer variant="modal" bind:this={menuDrawer} bind:open={$drawerStore.open}>
  <Header>
    <Title>MPV web</Title>
  </Header>
  <Content>
    <List>
      <Item on:SMUI:action={onMoviesClick}>
        <Graphic class="material-icons" aria-hidden="true">movie</Graphic>
        <Text>Movies</Text>
      </Item>
      <Item on:SMUI:action={onHistoryClick}>
        <Graphic class="material-icons" aria-hidden="true">history</Graphic>
        <Text>Playback history</Text>
      </Item>
    </List>
  </Content>
</Drawer>
<Scrim/>