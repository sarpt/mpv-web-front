<script lang="ts">
  import { ProgressCircular } from 'smelte';
  import { onDestroy } from 'svelte';

  import { changeMediaFile, playMediaFileArguments } from '../functions/api';
  import type { PlaybackHistoryEntry } from '../functions/db';
  import { getMediaFileName } from '../functions/media_file';
  import { getPlaybackHistory, playbackHistoryChanges } from '../functions/playback_history';
  import type { MediaFile } from '../models/api';
  import { mediaFilesStore } from '../stores/media_files';

  import PlayMediaDialog from './PlayMediaDialog.svelte';
  import Row from './Row.svelte';

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

  function handleAddToPlaylist(fullscreen: boolean, audioId: string, subtitleId: string) {
    const request: playMediaFileArguments = {
      append: true,
      path: selectedMediaFile?.Path || '',
      pause: false,
      fullscreen,
      audioId,
      subtitleId,
    };

    changeMediaFile(request);
  }

  function handlePlay(fullscreen: boolean, audioId: string, subtitleId: string) {
    const request: playMediaFileArguments = {
      append: false,
      path: selectedMediaFile?.Path || '',
      pause: false,
      fullscreen,
      audioId,
      subtitleId,
    };

    changeMediaFile(request);
  }
</script>

{#await playbackHistory}
  <ProgressCircular />
{:then playbackHistory} 
  {#if playbackHistory.length > 0}
    {#each playbackHistory as entry, idx}
    <Row selected={false}>
      <div class="media-file-entry" on:click={() => handleEntryClick(entry, idx)}>
          <div class="media-file-title">
            {getMediaFileName(entry)}
          </div>
      </div>
    </Row>
    {/each}
  {:else}
    <div>
      No playback history
    </div>
  {/if}
{/await}

<PlayMediaDialog
  bind:opened={dialogOpened}
  mediaFile={selectedMediaFile}
  bind:selectedAudioId
  bind:selectedSubtitleId
  handleAddToPlaylist={handleAddToPlaylist}
  handlePlay={handlePlay}
></PlayMediaDialog>

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
