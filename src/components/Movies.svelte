<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import type { MDCDialog } from '@material/dialog';

  import Paper, { Title, Content } from '@smui/paper';
  import LinearProgress from '@smui/linear-progress';

  import { secondsToHHMMSS } from '../functions/time';
  import { getMovieName } from '../functions/movie';
  import {
    getMovies,
    playMovie,
  } from '../functions/api';
  import type {
    Movie,
    Playback,
    playMovieRequest,
    AudioStream,
    SubtitleStream
  } from '../functions/api'; // neccessary 'import type', otherwise rollup will not find import value

  import { apiAddressStore } from '../stores/api_address';
  import { playbackStore } from '../stores/playback';
  import { moviesStore } from '../stores/movies';

  import ApiAddress from './ApiAddress.svelte';
  import MovieDialog from './MovieDialog.svelte';

  let dialogOpened = false;
  let selectedMovie: Movie | undefined;
  let playback: Playback | undefined;
  let movies: Movie[] = [];
  let isMovieFetchInProgress = false;

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
    fetchMovies();
  }

  function fetchMovies() {
    isMovieFetchInProgress = true;

    getMovies();
  }

  async function handlePlay(req: playMovieRequest) {
    return await playMovie(req);
  }

  function updatePlayback(updatedPlayback: Playback | undefined) {
    playback = updatedPlayback;
  }

  const apiAddressUnsubscribe = apiAddressStore.subscribe(handleAddressChange);
  const playbackUnsubscribe = playbackStore.subscribe(playbackState => {
    isMovieFetchInProgress = false;
    playback = playbackState.playback;
  });
  const moviesUnsubscribe = moviesStore.subscribe(moviesState => {
    movies = moviesState.movies;
  });

  onDestroy(() => {
    apiAddressUnsubscribe();
    playbackUnsubscribe();
  });
</script>

{#if isMovieFetchInProgress}
  <Paper transition elevation={1}>
    <LinearProgress indeterminate />
  </Paper>
{:else}
  {#if movies.length > 0}
      {#each movies as movie, idx}
        <div class="movie-entry" on:click={() => handleMovieEntryClick(movie, idx)}>
          <Paper transition color={getColor(movie, playback)}>
              <Title>
                <div class="movie-title">
                  {getMovieName(movie)}
                </div>
              </Title>
          </Paper>
        </div>
      {/each}
  {:else}
    <div>
      Seems there are no movies :/
    </div>
  {/if}
{/if}

<MovieDialog bind:opened={dialogOpened} movie={selectedMovie} {dialogCloseHandler}></MovieDialog>

<style lang="scss">
  .movie-entry {
    margin-bottom: 5px;
    cursor: pointer;
  }

  .movie-title {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
