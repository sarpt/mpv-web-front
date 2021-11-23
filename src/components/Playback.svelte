<script lang="ts">
  import {
    Button,
    ProgressLinear,
  } from 'smelte';

  import { fullscreen, pause } from "../functions/api";
  import { LoopVariant } from "../models/api";
  import type { MediaFile, MediaFilesMap, Playback} from "../models/api";
  import { secondsToHHMMSS } from "../functions/time";
  import { getMediaFileName } from "../functions/media_file";
  import { playbackStore } from '../stores/playback';

  import PlaybackSettingsDialog from "./PlaybackSettingsDialog.svelte";
  import PlaybackRepeatDialog from "./PlaybackRepeatDialog.svelte";

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

  $: playingMediaFileProgress = (!!playback && !!currentMediaFile && currentMediaFile.Duration > 0)
    ? (playback.CurrentTime / currentMediaFile.Duration) * 100
    : 0;

  const openPlaybackSettings = () => { playbackSettingsOpened = true }
  const openRepeatSettings = () => { repeatSettingsOpened = true }

  const handlePlaybackSettingsChanged = (audioId: string, subtitleId: string) => {
    postPlayback({
      audioId,
      subtitleId,
    });
  }

  const handleRepeatSettingsChanged = (loopVariant: LoopVariant) => {
    postPlayback({
      loopFile: loopVariant === LoopVariant.File,
    });
  }

  const handleMenuClick = () => drawerStore.set({ open: true });
</script>

<div class="playback">
  <div class="info">
    {#if !!playback && !!currentMediaFile}
      <div class="name">{getMediaFileName(currentMediaFile)}</div>
      <div class="progress-container">
        <span>{secondsToHHMMSS(playback.CurrentTime)} - {secondsToHHMMSS(currentMediaFile.Duration)}</span>
        <ProgressLinear color='white' progress={playingMediaFileProgress} />
      </div>
    {:else}
      No playback
    {/if}
  </div>
  <div class="actions">
    <div class="button-group">
      <Button
        icon='menu_open'
        on:click={handleMenuClick}
        small
        outlined
      />
    </div>
    <div class="button-group">
      {#if playback?.Paused}
        <Button
          on:click={() => pause(false)}
          disabled={!playback}
          icon='play_arrow'
          small
          outlined
        />
      {:else}
        <Button
          on:click={() => pause(true)}
          disabled={!playback}
          icon='pause'
          small
          outlined
        />
      {/if}
      {#if playback?.Fullscreen}
        <Button
          on:click={() => fullscreen(false)}
          disabled={!playback}
          icon='fullscreen_exit'
          small
          outlined
        />
      {:else}
        <Button
          on:click={() => fullscreen(true)}
          disabled={!playback}
          icon='fullscreen'
          small
          outlined
        />
      {/if}

      <Button
        on:click={openRepeatSettings}
        disabled={!playback}
        icon='repeat'
        small
        outlined
      />
      <PlaybackRepeatDialog
        bind:opened={repeatSettingsOpened}
        initialLoopVariant={playback?.Loop.Variant ?? LoopVariant.File}
        dialogCloseHandler={handleRepeatSettingsChanged}
      >
      </PlaybackRepeatDialog>

      <Button
        on:click={openPlaybackSettings}
        disabled={!playback}
        icon='video_settings'
        small
        outlined
      />
      <PlaybackSettingsDialog
        bind:opened={playbackSettingsOpened}
        audioId={playback?.SelectedAudioID}
        subtitleId={playback?.SelectedSubtitleID}
        currentMediaFile={currentMediaFile}
        dialogCloseHandler={handlePlaybackSettingsChanged}
      >
      </PlaybackSettingsDialog>
    </div>
    <div class="button-group"></div>
  </div>
</div>

<style lang="scss">
  .button-group {
    display: flex;
    flex-direction: row;

    :global(button) {
      margin: 0px 2px;
    }

    :global(button:disabled) {
      background-color: inherit;
      border: none;
    }

    :global(button:enabled > i) {
      color: white;
    }
  }

  .info {
    color: white;
  }

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