<script lang="ts">
  import { initRouter, Routes } from '../functions/routing';
  import { routingStore } from '../stores/routing';

	import MediaFiles from './MediaFiles.svelte';
	import PlaybackHistory from "./PlaybackHistory.svelte";
  import Playlist from './Playlist.svelte';

  let pageComponent: any;
  let params: any;
  
  initRouter({
    [Routes.Root]: () => {$routingStore.route = Routes.MediaFiles; pageComponent = MediaFiles},
    [Routes.MediaFiles]: () => {$routingStore.route = Routes.MediaFiles; pageComponent = MediaFiles},
    [Routes.PlaybackHistory]:  () => {$routingStore.route = Routes.PlaybackHistory; pageComponent = PlaybackHistory},
    [Routes.Playlist]: () => {$routingStore.route = Routes.Playlist; pageComponent = Playlist}
  });
</script>

<svelte:component this={pageComponent} params={params}></svelte:component>