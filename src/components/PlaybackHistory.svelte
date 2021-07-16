<script lang="ts">
  import { onDestroy } from 'svelte';
  import Paper, { Title } from '@smui/paper/styled';

  import { changeMovie, playMovieArguments } from '../functions/api';
  import type { PlaybackHistoryEntry } from '../functions/db';
  import { getMovieName } from '../functions/movie';
  import { getPlaybackHistory, playbackHistoryChanges } from '../functions/playback_history';
  import type { Movie } from '../models/api';
  import { MovieDialogActions } from '../models/dialogs';
  import { moviesStore } from '../stores/movies';

  import Loading  from './Loading.svelte';
  import PlayMovieDialog from './PlayMovieDialog.svelte';

  $: movies = $moviesStore.movies;

  let playbackHistory = getPlaybackHistory();
  let dialogOpened = false;
  let selectedMovie: Movie | undefined;
  let selectedAudioId = '';
  let selectedSubtitleId = '';

  const subscription = playbackHistoryChanges().subscribe(async () => {
    playbackHistory = getPlaybackHistory(); // TODO: reimplement to using changes instead of fetching the whole state every time (svelte store?)
  });

  onDestroy(() => {
    subscription.unsubscribe();
  }); 

  function handleEntryClick(entry: PlaybackHistoryEntry, idx: number) {
    selectedSubtitleId = entry.SubtitleID;
    selectedAudioId = entry.AudioID;
    selectedMovie = movies[entry.Path];
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
        changeMovie(request);
        break;
      case MovieDialogActions.Play:
        changeMovie(request);
        break;
      default:
        return;
    }
  }
</script>

{#await playbackHistory}
  <Loading />
{:then playbackHistory} 
  {#if playbackHistory.length > 0}
    {#each playbackHistory as entry, idx}
      <div class="movie-entry" on:click={() => handleEntryClick(entry, idx)}>
        <Paper transition>
          <Title>
            <div class="movie-title">
              {getMovieName(entry)}
            </div>
          </Title>
        </Paper>
      </div>
    {/each}
  {:else}
    <div>
      No playback history
    </div>
  {/if}
{/await}

<PlayMovieDialog bind:opened={dialogOpened} movie={selectedMovie} {selectedAudioId} {selectedSubtitleId} {dialogCloseHandler}></PlayMovieDialog>

<style lang="scss">
  .movie-entry {
    margin-bottom: 5px;
    cursor: pointer;
  }

  .movie-title {
    overflow-x: hidden;
    overflow-y: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
