<script lang="ts">
	import TopAppBar, {Row, Section, Title, FixedAdjust } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import Movies from './Movies.svelte';

	let collapsed = false;
	const title = 'MPV web'
	const variant = 'standard';
</script>

<TopAppBar bind:collapsed {variant}>
	<Row>
		<Section>
			<IconButton class="material-icons">menu</IconButton>
			<Title>{title}</Title>
		</Section>
	</Row>
</TopAppBar>
<main use:FixedAdjust>
	<div class="view-container">
		<Movies></Movies>
	</div>
</main>

<style lang="scss">
	main {
		margin: 0 auto;
	}

	.view-container {
		padding: 0 0.5rem;
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