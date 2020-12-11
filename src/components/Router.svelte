<script lang="ts">
	import Movies from './Movies.svelte';
	import ApiAddress from './ApiAddress.svelte';
	import PlaybackHistory from "./PlaybackHistory.svelte";
  import { initRouter, Routes } from '../functions/routing';

  let pageComponent: any;
  let params: any;
  
  initRouter({
    [Routes.Root]: () => pageComponent = Movies,
    [Routes.ApiAddress]: () => pageComponent = ApiAddress,
    [Routes.Movies]: () => pageComponent = Movies,
    [Routes.PlaybackHistory]:  () => pageComponent = PlaybackHistory,
  });
</script>

<svelte:component this={pageComponent} params={params}></svelte:component>