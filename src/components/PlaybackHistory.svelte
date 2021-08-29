<script lang="ts">
  import { onDestroy } from 'svelte';
  import Paper, { Title } from '@smui/paper/styled';

  import { changeMediaFile, playMediaFileArguments } from '../functions/api';
  import type { PlaybackHistoryEntry } from '../functions/db';
  import { getMediaFileName } from '../functions/media_file';
  import { getPlaybackHistory, playbackHistoryChanges } from '../functions/playback_history';
  import type { MediaFile } from '../models/api';
  import { MediaFileDialogActions } from '../models/dialogs';
  import { mediaFilesStore } from '../stores/media_files';

  import Loading  from './Loading.svelte';
  import PlayMediaDialog from './PlayMediaDialog.svelte';

  $: mediaFiles = $mediaFilesStore.mediaFiles;

  let playbackHistory = getPlaybackHistory();
  let dialogOpened = false;
  let selectedMediaFile: MediaFile | undefined;
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
    selectedMediaFile = mediaFiles[entry.Path];
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
</script>

{#await playbackHistory}
  <Loading />
{:then playbackHistory} 
  {#if playbackHistory.length > 0}
    {#each playbackHistory as entry, idx}
      <div class="media-file-entry" on:click={() => handleEntryClick(entry, idx)}>
        <Paper transition>
          <Title>
            <div class="media-file-title">
              {getMediaFileName(entry)}
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

<PlayMediaDialog bind:opened={dialogOpened} mediaFile={selectedMediaFile} bind:selectedAudioId bind:selectedSubtitleId {dialogCloseHandler}></PlayMediaDialog>

<style lang="scss">
  .media-file-entry {
    margin-bottom: 5px;
    cursor: pointer;
  }

  .media-file-title {
    overflow-x: hidden;
    overflow-y: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
