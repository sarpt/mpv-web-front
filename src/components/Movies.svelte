<script lang="ts">
  import Paper, { Title } from '@smui/paper';

  import { getMovieName } from '../functions/movie';
  import {
    changeMovie,
  } from '../functions/api';
  import type {
    playMovieArguments 
  } from '../functions/api';
  import type {
    Movie,
    Playback,
  } from '../models/api'; // neccessary 'import type', otherwise rollup will not find import value
  import { MovieDialogActions } from '../models/dialogs';

  import { playbackStore } from '../stores/playback';
  import { moviesStore } from '../stores/movies';

  import MovieDialog from './MovieDialog.svelte';

  let dialogOpened = false;
  let selectedMovie: Movie | undefined;
  let playback: Playback | undefined;
  let movies: Movie[] = [];

  $: getColor = (movie: Movie, playback: Playback | undefined): string => {
    return !!playback && movie.Path === playback.MoviePath ? 'primary' : 'none';
  }

  function handleMovieEntryClick(movie: Movie, idx: number) {
    selectedMovie = movie;
    dialogOpened = true;
  }

  function dialogCloseHandler(action: string, fullscreen: boolean, audioId: string, subtitleId: string) {
    const request: playMovieArguments = {
      append: false,
      path: selectedMovie?.Path || '',
      pause: false,
      fullscreen,
      audioId,
      subtitleId,
    }

    switch (action) {
      case MovieDialogActions.Added:
        request.append = true;
        handlePlay(request);
        break;
      case MovieDialogActions.Play:
        handlePlay(request);
        break;
      default:
        return;
    }
  }

  async function handlePlay(req: playMovieArguments) {
    return await changeMovie(req);
  }

  $: playback = $playbackStore.playback;
  $: movies = Object.values($moviesStore.movies);
</script>

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
    overflow-y: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
