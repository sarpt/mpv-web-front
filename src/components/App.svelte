<script lang="ts">
	import Movies from './Movies.svelte';
	import Playback from './Playback.svelte';

	const title = 'MPV web'
	const variant = 'standard';
</script>

<main>
	<div class="view-container">
		<Movies></Movies>
	</div>
	<div class="playback-container smui-paper smui-paper--color-primary">
		<Playback></Playback>
	</div>
</main>

<style lang="scss">
	main {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		max-height: 100vh;
	}

	.view-container {
		padding: 0 0.5rem;
		flex-shrink: 1;
		flex-grow: 1;
		overflow-y: scroll;
	}

	.playback-container {
		flex-shrink: 0;
		height: 50px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}

		.view-container {
			padding: 0 1rem;
		}
	}

</style>