<script lang="ts">
  import { onMount } from 'svelte';

  import Paper, {Title, Content} from '@smui/paper';

  import { getMovies, getInitialMovies, defaultAddress } from '../functions/api';
  import ApiAddress from './ApiAddress.svelte';

  let movieFetchFailed: boolean = false;
  let movies = getInitialMovies();
  let activeMovieEntryIdx = -1
  let apiAddress: string = defaultAddress;

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
    fetchMovies(apiAddress);
  }

  async function fetchMovies(address: string) {
    try {
      movieFetchFailed = false;
      movies = await getMovies(address);
    } catch (err) {
      movieFetchFailed = true;
    }
  }

  onMount(() => fetchMovies(apiAddress));
</script>

{#if !movieFetchFailed}
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
{:else}
  <ApiAddress address={apiAddress} on:address-change={ev => handleAddressChange(ev.detail.address)}></ApiAddress>
{/if}

<style lang="scss">
  .movie-entry {
    margin-bottom: 5px;
    cursor: pointer;
  }
</style>
