<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { apiConnectionStore } from "../stores/api_connection";
	import { appInit } from "../functions/app_init";

	import ApiAddressDialog from './ApiAddressDialog.svelte';
	import Drawer from './Drawer.svelte';
	import Playback from './Playback.svelte';
	import Router from "./Router.svelte";

	let mainElement: HTMLElement;
	let intersectionObserverTrigger: HTMLElement;
	let apiAddressDialogOpened = false;

	appInit();

	function handleWindowResize() {
		const vh = window.innerHeight * 0.01;
		mainElement.style.setProperty('--vh', `${vh}px`);
	}

	// workaround for mobile browsers changing window size (adding address bar) without repainting.
	// works better than setting heights to 100vh
	window.addEventListener('resize', handleWindowResize);

	let apiConnectionUnsubscribe: (() => void) | undefined;
	onDestroy(() => {
		window.removeEventListener('resize', handleWindowResize);
		!!apiConnectionUnsubscribe && apiConnectionUnsubscribe(); // cursed  
	});

	onMount(() => {
		apiConnectionUnsubscribe = apiConnectionStore.subscribe(apiConnectionState => {
			apiAddressDialogOpened = !apiConnectionState.connected;
		});

		const intersectionCallback = () => {
			handleWindowResize();
		}

		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0
		}
		
		// Observer catches every disappearance of an empty element below playback element,
		// since 'resize' does not fire on an initial page paint and in case of a resize occuring sooner than necessary
		// observer ensures repaint when trigger appears/disappears additionally to every resize.
		const observer = new IntersectionObserver(intersectionCallback, options);
		observer.observe(intersectionObserverTrigger);
	});
</script>

<main bind:this={mainElement}>
	<ApiAddressDialog opened={apiAddressDialogOpened}></ApiAddressDialog>
	<Drawer></Drawer>
	<div class="view-container">
		<Router></Router>
	</div>
	<div class="playback-container">
		<Playback></Playback>
	</div>
	<div bind:this={intersectionObserverTrigger}></div>
</main>

<style lang="scss">
	main {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		min-height: calc(var(--vh, 1vh) * 100);
		max-height: calc(var(--vh, 1vh) * 100);
	}

	:global(button > span) {
		display: flex;
		flex-direction: row;
		align-items: center;
		line-height: 1rem;
	}

	.view-container {
		flex-shrink: 1;
		flex-grow: 1;
		overflow-y: hidden;
		display: flex;
		flex-direction: column
	}

	.playback-container {
		@apply bg-primary-400;
    padding: 24px 16px;
		flex-shrink: 0;
		height: 120px;
	}
</style>