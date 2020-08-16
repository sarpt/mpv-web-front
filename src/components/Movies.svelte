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

  let selectedMovie: Movie | undefined;
  let playback: Playback | undefined;
  let movies = fetchMovies();
  let eventDialog: MDCDialog;

  $: getElevation = (movie: Movie): number => {
    return !!playback && movie === playback.Movie ? 7 : 1;
  }

  $: playingMovieProgress = (!!playback && playback.Movie.Duration > 0) ? (playback.CurrentTime / playback.Movie.Duration) : 0;

  function handleMovieEntryClick(movie: Movie, idx: number) {
    selectedMovie = movie;
    eventDialog.open()
  }

  function dialogCloseHandler(action: string, fullscreen: boolean, audio: AudioStream, subtitle: SubtitleStream) {
    switch (action) {
      case 'play':
        const request: playMovieRequest = {
          path: selectedMovie?.Path || '',
          fullscreen,
          audioId: audio.AudioID,
          subtitleId: subtitle. SubtitleID,
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

  const updatePlayback = (updatedPlayback: Playback) => {
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
          <Paper transition elevation={getElevation(movie)}>
            <Title>
              {getMovieName(movie.Path)}
            </Title>
            {#if !!playback && movie.Path === playback.Movie.Path}
              <Content>
                <div class="progress-container">
                  <span>{secondsToHHMMSS(playback.CurrentTime)}-{secondsToHHMMSS(playback.Movie.Duration)}</span>
                  <LinearProgress progress={playingMovieProgress} />
                </div>
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
  <ApiAddress></ApiAddress>
{/await}

<MovieDialog bind:eventDialog={eventDialog} movie={selectedMovie} {dialogCloseHandler}></MovieDialog>

<style lang="scss">
  .movie-entry {
    margin-bottom: 5px;
    cursor: pointer;
  }

  .progress-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    
    > span {
      flex-shrink: 0;
      flex-grow: 0;
      margin-right: 0.5rem;
    }
  }
</style>
