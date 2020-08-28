<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { MDCDialog } from '@material/dialog';

  import Paper, { Title, Content } from '@smui/paper';
  import LinearProgress from '@smui/linear-progress';

  import { secondsToHHMMSS } from '../functions/time';
  import { getMovieName } from '../functions/movie';
  import {
    getMovies,
    playMovie,
    subscribeToPlaybackChanges
  } from '../functions/api';
  import type {
    Movie,
    Playback,
    playMovieRequest,
    AudioStream,
    SubtitleStream
  } from '../functions/api'; // neccessary 'import type', otherwise rollup will not find import value

  import { apiAddress } from '../stores/api_address';

  import ApiAddress from './ApiAddress.svelte';
  import MovieDialog from './MovieDialog.svelte';

  let dialogOpened = false;
  let selectedMovie: Movie | undefined;
  let playback: Playback | undefined;
  let movies: Promise<Movie[]> = Promise.resolve([]);

  $: getColor = (movie: Movie, playback: Playback | undefined): string => {
    return !!playback && movie.Path === playback.Movie.Path ? 'primary' : 'none';
  }

  function handleMovieEntryClick(movie: Movie, idx: number) {
    selectedMovie = movie;
    dialogOpened = true;
  }

  function dialogCloseHandler(action: string, fullscreen: boolean, audioId: string, subtitleId: string) {
    switch (action) {
      case 'play':
        const request: playMovieRequest = {
          path: selectedMovie?.Path || '',
          fullscreen,
          audioId,
          subtitleId,
        }
        handlePlay(request);
        break;
      case 'add':
        // TODO: to be implemented
        break;
      default:
    }
  }

  function handleAddressChange() {
    movies = fetchMovies();
  }

  async function fetchMovies() {
    return await getMovies();
  }

  async function handlePlay(req: playMovieRequest) {
    return await playMovie(req);
  }

  function updatePlayback(updatedPlayback: Playback) {
    playback = updatedPlayback;
  }

  const handleConnectionError = () => {
    movies = Promise.reject();
  }

  const apiAddressUnsubscribe = apiAddress.subscribe(handleAddressChange);

  onMount(() => {
    subscribeToPlaybackChanges({ playbackEventHandler: updatePlayback, errorHandler: handleConnectionError });
  });

  onDestroy(() => {
    apiAddressUnsubscribe();
  });
</script>

{#await movies}
  <Paper transition elevation={1}>
    <LinearProgress indeterminate />
  </Paper>
{:then movies}
  {#if movies.length > 0}
      {#each movies as movie, idx}
        <div class="movie-entry" on:click={() => handleMovieEntryClick(movie, idx)}>
          <Paper transition color={getColor(movie, playback)}>
            <Title>
              {getMovieName(movie)}
            </Title>
          </Paper>
        </div>
      {/each}
  {:else}
    <div>
      Seems there are no movies :/
    </div>
  {/if}
{:catch}
  <ApiAddress></ApiAddress>
{/await}

<MovieDialog bind:opened={dialogOpened} movie={selectedMovie} {dialogCloseHandler}></MovieDialog>

<style lang="scss">
  .movie-entry {
    margin-bottom: 5px;
    cursor: pointer;
  }
</style>
