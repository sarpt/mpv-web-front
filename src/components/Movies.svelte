<script lang="ts">
  import { onDestroy } from 'svelte';

  import Paper, { Title } from '@smui/paper';
  import LinearProgress from '@smui/linear-progress';

  import { getMovieName } from '../functions/movie';
  import {
    fetchAllMovies,
    changeMovie,
  } from '../functions/api';
  import type {
    playMovieArguments 
  } from '../functions/api';
  import type {
    Movie,
    Playback,
  } from '../models/api'; // neccessary 'import type', otherwise rollup will not find import value

  import { apiAddressStore } from '../stores/api_address';
  import { playbackStore } from '../stores/playback';
  import { moviesStore } from '../stores/movies';

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
        const request: playMovieArguments = {
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

    fetchAllMovies();
  }

  async function handlePlay(req: playMovieArguments) {
    return await changeMovie(req);
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
    moviesUnsubscribe();
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

  @media (max-width: 640px) {
    :global(.smui-paper) {
      padding: 9px 6px;
    }

    :global(.smui-paper .smui-paper__title) {
      font-size: small;
      line-height: 1em;
      margin-bottom: 0;
    }
  }

  .movie-title {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
