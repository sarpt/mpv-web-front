<script lang="ts">
  import LinearProgress from '@smui/linear-progress/styled';
  import IconButton from '@smui/icon-button/styled';

  import { fullscreen, pause } from "../functions/api";
  import { LoopVariant } from "../models/api";
  import type { MediaFile, MediaFilesMap, Playback} from "../models/api";
  import { secondsToHHMMSS } from "../functions/time";
  import { getMediaFileName } from "../functions/media_file";
  import { playbackStore } from '../stores/playback';

  import PlaybackSettingsDialog from "./PlaybackSettingsDialog.svelte";
  import PlaybackRepeatDialog from "./PlaybackRepeatDialog.svelte";

  import './Playback.scss';
  import { postPlayback } from "../functions/rest";
  import { drawerStore } from "../stores/drawer";
  import { mediaFilesStore } from "../stores/media_files";

  function getCurrentMediaFile(playback: Playback | undefined, mediaFiles: MediaFilesMap): MediaFile | undefined {
    if (!playback) return;

    return mediaFiles[playback.MediaFilePath];
  }

  $: mediaFiles = $mediaFilesStore.mediaFiles;
  $: playback = $playbackStore.playback;
  $: currentMediaFile = getCurrentMediaFile(playback, mediaFiles);
  let playbackSettingsOpened = false;
  let repeatSettingsOpened = false;

  $: playingMediaFileProgress = (!!playback && !!currentMediaFile && currentMediaFile.Duration > 0) ? (playback.CurrentTime / currentMediaFile.Duration) : 0;

  const openPlaybackSettings = () => { playbackSettingsOpened = true }
  const openRepeatSettings = () => { repeatSettingsOpened = true }

  const handlePlaybackSettingsChanged = (action: string, audioId: string, subtitleId: string) => {
    postPlayback({
      audioId,
      subtitleId,
    });
  }

  const handleRepeatSettingsChanged = (action: string, loopVariant: LoopVariant) => {
    postPlayback({
      loopFile: loopVariant === LoopVariant.File,
    });
  }

  const handleMenuClick = () => drawerStore.set({ open: true });
</script>

<div class="playback">
  {#if !!playback && !!currentMediaFile}
    <div class="name">{getMediaFileName(currentMediaFile)}</div>
    <div class="progress-container">
      <span>{secondsToHHMMSS(playback.CurrentTime)} - {secondsToHHMMSS(currentMediaFile.Duration)}</span>
      <LinearProgress class="playback-progress" progress={playingMediaFileProgress} />
    </div>
  {:else}
    No playback
  {/if}
  <div class="actions">
    <div>
      <IconButton class="material-icons" on:click={handleMenuClick}>menu_open</IconButton>
    </div>
    <div>
      {#if playback?.Paused}
        <IconButton class="material-icons" on:click={() => pause(false)} disabled={!playback}>play_arrow</IconButton>
      {:else}
        <IconButton class="material-icons" on:click={() => pause(true)} disabled={!playback}>pause</IconButton>
      {/if}
      {#if playback?.Fullscreen}
        <IconButton class="material-icons" on:click={() => fullscreen(false)} disabled={!playback}>fullscreen_exit</IconButton>
      {:else}
        <IconButton class="material-icons" on:click={() => fullscreen(true)} disabled={!playback}>fullscreen</IconButton>
      {/if}

      <IconButton class="material-icons" on:click={openRepeatSettings} disabled={!playback}>repeat</IconButton>
      <PlaybackRepeatDialog
        bind:opened={repeatSettingsOpened}
        initialLoopVariant={playback?.Loop.Variant ?? LoopVariant.File}
        dialogCloseHandler={handleRepeatSettingsChanged}
      >
      </PlaybackRepeatDialog>

      <IconButton class="material-icons" on:click={openPlaybackSettings} disabled={!playback}>video_settings</IconButton>
      <PlaybackSettingsDialog
        bind:opened={playbackSettingsOpened}
        playback={playback}
        currentMediaFile={currentMediaFile}
        dialogCloseHandler={handlePlaybackSettingsChanged}
      >
      </PlaybackSettingsDialog>
    </div>
    <div></div>
  </div>
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
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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