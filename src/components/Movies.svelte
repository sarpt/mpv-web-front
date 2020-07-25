<script lang="ts">
  import Paper, {Title, Content} from '@smui/paper';
  import LinearProgress from '@smui/linear-progress';

  import { getMovies, defaultAddress } from '../functions/api';
  import ApiAddress from './ApiAddress.svelte';

  let activeMovieEntryIdx = -1
  let apiAddress: string = defaultAddress;
  let movies = fetchMovies(apiAddress);

  $: getElevation = (idx: number): number => {
    return idx === activeMovieEntryIdx ? 7 : 1;
  }

  function handleMovieEntryClick(idx: number) {
    activeMovieEntryIdx = idx;
  }

  function getMovieName(path: string): string {
    const pathParts = path.split('/');
    return pathParts[pathParts.length - 1];
  }

  function handleAddressChange(newAddress: string) {
    apiAddress = newAddress;
    movies = fetchMovies(apiAddress);
  }

  async function fetchMovies(address: string) {
    return await getMovies(address);
  }
</script>

{#await movies}
  <Paper transition elevation={1}>
    <LinearProgress indeterminate />
  </Paper>
{:then movies}
  {#if movies.length > 0}
      {#each movies as movie, idx}
        <div class="movie-entry" on:click={() => handleMovieEntryClick(idx)}>
          <Paper transition elevation={getElevation(idx)}>
            <Title>{getMovieName(movie.Path)}</Title>
            {#if idx === activeMovieEntryIdx}
              <Content>
                Full path: {movie.Path}
              </Content>
            {/if}
          </Paper>
        </div>
      {/each}
  {:else}
    <div>
      Seems there are no movies :/
    </div>
  {/if}
{:catch}
  <ApiAddress address={apiAddress} on:address-change={ev => handleAddressChange(ev.detail.address)}></ApiAddress>
{/await}

<style lang="scss">
  .movie-entry {
    margin-bottom: 5px;
    cursor: pointer;
  }
</style>
