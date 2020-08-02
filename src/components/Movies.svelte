<script lang="ts">
  import { onMount } from 'svelte';

  import Paper, {Title, Content} from '@smui/paper';
  import LinearProgress from '@smui/linear-progress';
  import Dialog, {Title as DialogTitle, Content as DialogContent, Actions, InitialFocus} from '@smui/dialog';
  import Button, {Label, Icon} from '@smui/button';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';

  import { secondsToHHMMSS } from '../functions/time';
  import { getMovies, defaultAddress, playMovie, subscribeToPlaybackChanges } from '../functions/api';
  import type { Movie, Playback } from '../functions/api'; // neccessary 'import type', otherwise rollup will not find import value

  import ApiAddress from './ApiAddress.svelte';

  let selectedMovie: Movie | undefined;
  let playback: Playback | undefined;
  let apiAddress: string = defaultAddress;
  let movies = fetchMovies(apiAddress);
  let eventDialog;
  let fullscreen = true;

  $: getElevation = (movie: Movie): number => {
    return !!playback && movie === playback.Movie ? 7 : 1;
  }

  $: playingMovieProgress = (!!playback && playback.Movie.Duration > 0) ? (playback.CurrentTime / playback.Movie.Duration) : 0;

  function handleMovieEntryClick(movie: Movie, idx: number) {
    selectedMovie = movie;
    eventDialog.open()
  }

  function getMovieName(path: string): string {
    const pathParts = path.split('/');
    return pathParts[pathParts.length - 1];
  }

  function dialogCloseHandler(action: string) {
    switch (action) {
      case 'play':
        handlePlay(apiAddress, selectedMovie, fullscreen);
        break;
      case 'add':
        // TODO: to be implemented
        break;
      default:
    }
  }

  function handleAddressChange(newAddress: string) {
    apiAddress = newAddress;
    movies = fetchMovies(apiAddress);
  }

  async function fetchMovies(address: string) {
    return await getMovies(address);
  }

  async function handlePlay(address: string, movie: Movie, fullscreen: boolean) {
    return await playMovie(address, movie, fullscreen);
  }

  const updatePlayback = (updatedPlayback: Playback) => {
    playback = updatedPlayback;
  }

  onMount(() => {
    subscribeToPlaybackChanges(apiAddress, updatePlayback);
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
  <ApiAddress address={apiAddress} on:address-change={ev => handleAddressChange(ev.detail.address)}></ApiAddress>
{/await}

<Dialog bind:this={eventDialog} aria-labelledby="event-title" aria-describedby="event-content" on:MDCDialog:closed={ev => dialogCloseHandler(ev.detail.action)}>
  <DialogTitle id="event-title">{!!selectedMovie && getMovieName(selectedMovie.Path)}</DialogTitle>
  <DialogContent id="event-content">
    <FormField>
      <Checkbox bind:checked={fullscreen} />
      <span slot="label">Fullscreen</span>
    </FormField>
  </DialogContent>
  <Actions>
    <Button action="play" default use={[InitialFocus]}>
      <Icon class="material-icons">play_arrow</Icon>
      <Label>Play</Label>
    </Button>
    <Button action="add">
      <Icon class="material-icons">playlist_add</Icon>
      <Label>Add to playlist</Label>
    </Button>
  </Actions>
</Dialog>

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
