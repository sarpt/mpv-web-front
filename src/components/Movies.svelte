<script lang="ts">
  import Paper, {Title, Content} from '@smui/paper';
  import LinearProgress from '@smui/linear-progress';
  import Dialog, {Title as DialogTitle, Content as DialogContent, Actions, InitialFocus} from '@smui/dialog';
  import Button, {Label, Icon} from '@smui/button';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';

  import { getMovies, defaultAddress, playMovie } from '../functions/api';
  import type { Movie } from '../functions/api'; // neccessary 'import type', otherwise rollup will not find import value

  import ApiAddress from './ApiAddress.svelte';

  let selectedMovie: Movie | undefined;
  let playingMovie: Movie | undefined;
  let apiAddress: string = defaultAddress;
  let movies = fetchMovies(apiAddress);
  let eventDialog;
  let fullscreen = true;

  $: getElevation = (movie: Movie): number => {
    return movie === playingMovie ? 7 : 1;
  }

  function handleMovieEntryClick(movie: Movie, idx: number) {
    selectedMovie = movie;
    eventDialog.open()
  }

  function getMovieName(path: string): string {
    const pathParts = path.split('/');
    return pathParts[pathParts.length - 1];
  }

  function closeHandler(action: string) {
    switch (action) {
      case 'play':
        playingMovie = selectedMovie;
        handlePlay(apiAddress, playingMovie, fullscreen);
        break;
      case 'add':
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
            {#if movie === playingMovie}
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

<Dialog bind:this={eventDialog} aria-labelledby="event-title" aria-describedby="event-content" on:MDCDialog:closed={ev => closeHandler(ev.detail.action)}>
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
</style>
