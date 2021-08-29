<script lang="ts">
  import Paper, { Title } from '@smui/paper/styled';

  import { getMediaFileName } from '../functions/media_file';
  import {
    changeMediaFile,
  } from '../functions/api';
  import type {
    playMediaFileArguments 
  } from '../functions/api';
  import type {
    MediaFile,
    Playback,
  } from '../models/api'; // neccessary 'import type', otherwise rollup will not find import value
  import { MediaFileDialogActions } from '../models/dialogs';

  import { playbackStore } from '../stores/playback';
  import { mediaFilesStore } from '../stores/media_files';

  import PlayMediaDialog from './PlayMediaDialog.svelte';

  let dialogOpened = false;
  let selectedMediaFile: MediaFile | undefined;
  let playback: Playback | undefined;
  let mediaFiles: MediaFile[] = [];
  let selectedAudioId = ''; // TODO: this probably should not be held/decided by the MediaFiles component - consider setting state for a modal in the store
  let selectedSubtitleId = '';

  $: getColor = (mediaFile: MediaFile, playback: Playback | undefined): string => {
    return !!playback && mediaFile.Path === playback.MediaFilePath ? 'primary' : 'none';
  }

  function handleMediaFileEntryClick(mediaFile: MediaFile, idx: number) {
    selectedAudioId = mediaFile.AudioStreams[0]?.AudioID ?? '';
    selectedSubtitleId = mediaFile.SubtitleStreams[0]?.SubtitleID ?? '';
    selectedMediaFile = mediaFile;
    dialogOpened = true;
  }

  function dialogCloseHandler(action: string, fullscreen: boolean, audioId: string, subtitleId: string) {
    const request: playMediaFileArguments = {
      append: false,
      path: selectedMediaFile?.Path || '',
      pause: false,
      fullscreen,
      audioId,
      subtitleId,
    }

    switch (action) {
      case MediaFileDialogActions.Added:
        request.append = true;
        changeMediaFile(request);
        break;
      case MediaFileDialogActions.Play:
        changeMediaFile(request);
        break;
      default:
        return;
    }
  }

  $: playback = $playbackStore.playback;
  $: mediaFiles = Object.values($mediaFilesStore.mediaFiles);
</script>

{#if mediaFiles.length > 0}
    {#each mediaFiles as mediaFile, idx}
      <div class="media-file-entry" on:click={() => handleMediaFileEntryClick(mediaFile, idx)}>
        <Paper transition color={getColor(mediaFile, playback)}>
            <Title>
              <div class="media-file-title">
                {getMediaFileName(mediaFile)}
              </div>
            </Title>
        </Paper>
      </div>
    {/each}
{:else}
  <div>
    Seems there are no mediaFiles :/
  </div>
{/if}

<PlayMediaDialog bind:opened={dialogOpened} mediaFile={selectedMediaFile} bind:selectedAudioId bind:selectedSubtitleId {dialogCloseHandler}></PlayMediaDialog>

<style lang="scss">
  .media-file-entry {
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

  .media-file-title {
    overflow-x: hidden;
    overflow-y: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
