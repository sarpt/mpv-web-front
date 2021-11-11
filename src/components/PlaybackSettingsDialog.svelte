<script lang="ts">
  import {
    Button,
    Dialog,
    Select,
  } from 'smelte';

  import { getMediaFileName, getStreamName } from '../functions/media_file';
  import type { MediaFile } from '../models/api';

  export let opened: boolean;
  export let currentMediaFile: MediaFile | undefined;
  export let dialogCloseHandler: (audioId: string, subtitleId: string) => void;

  export let audioId = '';
  export let subtitleId = '';

  let selectedAudioId = '';
  let selectedSubtitleId = '';

  $: audioStreams = currentMediaFile?.AudioStreams.map(stream => ({ value: stream.AudioID, text: getStreamName(stream) }));
  $: subtitleStreams = currentMediaFile?.SubtitleStreams.map(stream => ({ value: stream.SubtitleID, text: getStreamName(stream) }));
  $: if (!opened) { // reset modal state to values from playback after closing
    selectedAudioId = audioId;
    selectedSubtitleId = subtitleId;
  }

  function handleCloseDialog() {
    dialogCloseHandler(selectedAudioId, selectedSubtitleId);
    opened = false;
  }
</script>

<Dialog
  name="playback-settings-dialog"
  bind:value={opened}
>
  <div slot="title">
    <span>{!!currentMediaFile ? getMediaFileName(currentMediaFile) : ''}</span>
  </div>
  <div slot="default" class="content">
    {#if !!currentMediaFile && currentMediaFile.AudioStreams && currentMediaFile.SubtitleStreams}
      <div class="row">
        <Select
          value={selectedAudioId}
          label="Audio track"
          disabled={!currentMediaFile || currentMediaFile.AudioStreams.length <= 1}
          items={audioStreams}
          on:change={v => (selectedAudioId = v.detail)}
        />
      </div>
      <div class="row">
        <Select
          value={selectedSubtitleId}
          label="Subtitle track"
          disabled={!currentMediaFile || currentMediaFile.SubtitleStreams.length <= 1}
          items={subtitleStreams}
          on:change={v => (selectedSubtitleId = v.detail)}
        />
      </div>
    {/if}
  </div>
  <div slot="actions">
    <Button
      on:click={() => handleCloseDialog()}
    >
      <span>
        <span class="material-icons">check</span>
        Apply
      </span>
    </Button>
  </div>
</Dialog>

<style lang="scss">
  .content, .row {
    display: flex;
    flex-direction: column;
  }
</style>