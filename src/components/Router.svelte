<script lang="ts">
	import Movies from './Movies.svelte';
	import ApiAddress from './ApiAddress.svelte';
	import PlaybackHistory from "./PlaybackHistory.svelte";
  import { initRouter, Routes } from '../functions/routing';
  import { routingStore } from '../stores/routing';

  let pageComponent: any;
  let params: any;
  
  initRouter({
    [Routes.Root]: () => {$routingStore.route = Routes.Movies; pageComponent = Movies},
    [Routes.ApiAddress]: () => {$routingStore.route = Routes.ApiAddress; pageComponent = ApiAddress},
    [Routes.Movies]: () => {$routingStore.route = Routes.Movies; pageComponent = Movies},
    [Routes.PlaybackHistory]:  () => {$routingStore.route = Routes.PlaybackHistory; pageComponent = PlaybackHistory},
  });
</script>

<svelte:component this={pageComponent} params={params}></svelte:component>