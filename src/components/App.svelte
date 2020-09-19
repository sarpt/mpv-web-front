<script lang="ts">
	import page from "page";
	import { onDestroy } from 'svelte';

	import { apiConnectionStore } from "../stores/api_connection";

	import Movies from './Movies.svelte';
	import Playback from './Playback.svelte';
	import ApiAddress from './ApiAddress.svelte';

	let playbackContainer: HTMLElement;

  let pageComponent: any;
  let params: any;

	// TODO: move this part into some kind of function/module
	page('/', () => pageComponent = Movies);
	page('/movies', () => pageComponent = Movies);
	page('/api-address', () => pageComponent = ApiAddress);

	page.start();

	function handleWindowResize() {
		const vh = window.innerHeight * 0.01;
		playbackContainer.style.setProperty('--vh', `${vh}px`);
	}

	const apiConnectionUnsubscribe = apiConnectionStore.subscribe(apiConnectionState => {
		apiConnectionState.connected ? page('/') : page('/api-address');
	});

	// workaround for mobile browsers changing window size (adding address bar) without repainting.
	// works better than setting heights to 100vh
	window.addEventListener('resize', handleWindowResize);

	onDestroy(() => {
		window.removeEventListener('resize', handleWindowResize);
		apiConnectionUnsubscribe();
	});
</script>

<main>
	<div class="view-container">
		<svelte:component this={pageComponent} params={params}></svelte:component>
	</div>
	<div bind:this={playbackContainer} class="playback-container smui-paper smui-paper--color-primary">
		<Playback></Playback>
	</div>
</main>

<style lang="scss">
	main {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		min-height: calc(var(--vh, 1vh) * 100);
		max-height: calc(var(--vh, 1vh) * 100);
	}

	.view-container {
		padding: 0 1rem;
		flex-shrink: 1;
		flex-grow: 1;
		overflow-y: scroll;
	}

	.playback-container {
		flex-shrink: 0;
		height: 80px;
	}

	@media (max-width: 640px) {
		.view-container {
			padding: 0 0.5rem;
		}
	}

</style>