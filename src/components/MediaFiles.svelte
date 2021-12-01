<script lang="ts">
  import VirtualScroll from "svelte-virtual-scroll-list"
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

  import { playbackStore } from '../stores/playback';
  import { mediaFilesStore } from '../stores/media_files';

  import PlayMediaDialog from './PlayMediaDialog.svelte';
  import Row from './Row.svelte';

  let dialogOpened = false;
  let selectedMediaFile: MediaFile | undefined;
  let playback: Playback | undefined;
  let mediaFiles: MediaFile[] = [];
  let selectedAudioId = ''; // TODO: this probably should not be held/decided by the MediaFiles component - consider setting state for a modal in the store
  let selectedSubtitleId = '';

  $: selected = (mediaFile: MediaFile, playback: Playback | undefined): boolean => {
    return !!playback && mediaFile.Path === playback.MediaFilePath;
  }

  function handleMediaFileEntryClick(mediaFile: MediaFile) {
    selectedAudioId = mediaFile.AudioStreams[0]?.AudioID ?? '';
    selectedSubtitleId = mediaFile.SubtitleStreams[0]?.SubtitleID ?? '';
    selectedMediaFile = mediaFile;
    dialogOpened = true;
  }

  const dialogPlayHandler = (fullscreen: boolean, audioId: string, subtitleId: string) => {
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

  const dialogAddToPlaylistHandler = (fullscreen: boolean, audioId: string, subtitleId: string) => {
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

  $: playback = $playbackStore.playback;
  $: mediaFiles = Object.values($mediaFilesStore.mediaFiles);
</script>

<PlayMediaDialog
  bind:opened={dialogOpened}
  mediaFile={selectedMediaFile}
  bind:selectedAudioId
  bind:selectedSubtitleId
  handlePlay={dialogPlayHandler}
  handleAddToPlaylist={dialogAddToPlaylistHandler}
></PlayMediaDialog>

{#if mediaFiles.length > 0}
    <VirtualScroll
      rootNodeClass="virtual-scroll"
      data={mediaFiles}
      key="Path"
      let:data
      let:idx
    >
      <div class="media-file-entry" on:click={() => handleMediaFileEntryClick(data)}>
        <Row
          selected={selected(data, playback)}
          odd={idx % 2 !== 0}
        >
          <div class="media-file-title" slot="content">
            {getMediaFileName(data)}
          </div>
        </Row>
      </div>
    </VirtualScroll>
{:else}
  <div>
    Seems there are no mediaFiles :/
  </div>
{/if}

<style lang="scss">
  .media-file-entry {
    margin: 4px 0px;
    cursor: pointer;
  }

  .media-file-title {
    overflow-x: hidden;
    overflow-y: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :global(.virtual-scroll) {
		padding: 0 1rem;
    flex-grow: 0;
  }

	@media (max-width: 640px) {
		.virtual-scroll {
			padding: 0 0.5rem;
		}
	}
</style>
