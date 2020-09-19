<script lang="ts">
  import { onDestroy } from "svelte";

  import LinearProgress from '@smui/linear-progress';
  import IconButton from '@smui/icon-button';

  import { fullscreen, pause } from "../functions/api";
  import type { Playback } from "../models/api";
  import { secondsToHHMMSS } from "../functions/time";
  import { getMovieName } from "../functions/movie";
  import { playbackStore } from '../stores/playback';

  import './Playback.scss';

  let playback: Playback | undefined;

  $: playingMovieProgress = (!!playback && playback.Movie.Duration > 0) ? (playback.CurrentTime / playback.Movie.Duration) : 0;

  function updatePlayback(updatedPlayback: Playback | undefined) {
    playback = updatedPlayback;
  }

  const playbackUnsubscribe = playbackStore.subscribe(playbackState => {
    updatePlayback(playbackState.playback);
  });

  onDestroy(() => {
    playbackUnsubscribe();
  });
</script>

<div class="playback">
  {#if !!playback}
    <div class="name">{getMovieName(playback.Movie)}</div>
    <div class="progress-container">
      <span>{secondsToHHMMSS(playback.CurrentTime)} - {secondsToHHMMSS(playback.Movie.Duration)}</span>
      <LinearProgress class="playback-progress" progress={playingMovieProgress} />
    </div>
    <div class="actions">
      {#if playback?.Paused}
        <IconButton class="material-icons" on:click={() => pause(false)}>play_arrow</IconButton>
      {:else}
        <IconButton class="material-icons" on:click={() => pause(true)}>pause</IconButton>
      {/if}
      {#if playback?.Fullscreen}
        <IconButton class="material-icons" on:click={() => fullscreen(false)}>fullscreen_exit</IconButton>
      {:else}
        <IconButton class="material-icons" on:click={() => fullscreen(true)}>fullscreen</IconButton>
      {/if}

      <IconButton class="material-icons" on:click={() => {}}>repeat</IconButton>
      <IconButton class="material-icons" on:click={() => {}}>subtitles</IconButton>
      <IconButton class="material-icons" on:click={() => {}}>audiotrack</IconButton>
    </div>
  {:else}
    No playback
  {/if}
</div>

<style lang="scss">
  .playback {
    display: flex;
    flex-direction: column;
  }

  .name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
    font-weight: bold;
  }

  .actions {
    align-self: center;
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