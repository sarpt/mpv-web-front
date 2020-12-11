<script lang="ts">
  import { onDestroy } from "svelte";

  import LinearProgress from '@smui/linear-progress';
  import IconButton from '@smui/icon-button';

  import { fullscreen, pause } from "../functions/api";
  import { LoopVariant } from "../models/api";
  import type { Playback } from "../models/api";
  import { secondsToHHMMSS } from "../functions/time";
  import { getMovieName } from "../functions/movie";
  import { playbackStore } from '../stores/playback';
  import { PlaybackSettingsDialogActions } from '../models/dialogs';

  import PlaybackSettingsDialog from "./PlaybackSettingsDialog.svelte";
  import PlaybackRepeatDialog from "./PlaybackRepeatDialog.svelte";

  import './Playback.scss';
  import { postPlayback } from "../functions/rest";

  let playback: Playback | undefined;
  let playbackSettingsOpened = false;
  let repeatSettingsOpened = false;
  export let onHistoryClick: () => void;

  $: playingMovieProgress = (!!playback && playback.Movie.Duration > 0) ? (playback.CurrentTime / playback.Movie.Duration) : 0;

  function updatePlayback(updatedPlayback: Playback | undefined) {
    playback = updatedPlayback;
  }

  const playbackUnsubscribe = playbackStore.subscribe(playbackState => {
    updatePlayback(playbackState.playback);
  });

  const openPlaybackSettings = () => { playbackSettingsOpened = true }
  const openRepeatSettings = () => { repeatSettingsOpened = true }

  const handlePlaybackSettingsChanged = (action: string, audioId: string, subtitleId: string) => {
    if (action === PlaybackSettingsDialogActions.Close) return;

    postPlayback({
      audioId,
      subtitleId,
    });
  }

  const handleRepeatSettingsChanged = (action: string, loopVariant: LoopVariant) => {
    if (action === PlaybackSettingsDialogActions.Close) return;

    postPlayback({
      loopFile: loopVariant === LoopVariant.File,
    });
  }

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

      <IconButton class="material-icons" on:click={openRepeatSettings}>repeat</IconButton>
      <PlaybackRepeatDialog
        bind:opened={repeatSettingsOpened}
        initialLoopVariant={playback.Loop.Variant}
        dialogCloseHandler={handleRepeatSettingsChanged}
      >
      </PlaybackRepeatDialog>

      <IconButton class="material-icons" on:click={openPlaybackSettings}>video_settings</IconButton>
      <PlaybackSettingsDialog
        bind:opened={playbackSettingsOpened}
        playback={playback}
        dialogCloseHandler={handlePlaybackSettingsChanged}
      >
      </PlaybackSettingsDialog>

      <IconButton class="material-icons" on:click={onHistoryClick}>history</IconButton>
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