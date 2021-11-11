<script lang="typescript">
  import {
    Button,
    Checkbox,
    Dialog,
    Select
  } from 'smelte';

  import { getMediaFileName, getStreamName } from '../functions/media_file';

  import type { MediaFile } from '../models/api';

  type actionHandler = (fullscreen: boolean, audioId: string, subtitleId: string) => void;
  export let handlePlay: actionHandler;
  export let handleAddToPlaylist: actionHandler;
  export let mediaFile: MediaFile | undefined;
  export let opened: boolean;
  export let selectedAudioId = '';
  export let selectedSubtitleId = '';

  let fullscreen: boolean = false;
  $: audioStreams = mediaFile?.AudioStreams.map(stream => ({ value: stream.AudioID, text: getStreamName(stream) }))
    || [{ value: '', text: 'None'}];
  $: subtitleStreams = mediaFile?.SubtitleStreams.map(stream => ({ value: stream.SubtitleID, text: getStreamName(stream) }))
    || [{ value: '', text: 'None'}];

  const handleAction = (callback: actionHandler) => {
    callback(fullscreen, selectedAudioId, selectedSubtitleId);
    opened = false;
  }
</script>

<Dialog
  name='media-file-dialog'
  bind:value={opened}
>
  <div slot="title">
    <span>{!!mediaFile ? getMediaFileName(mediaFile) : ''}</span>
  </div>
  <div class="content" slot="default">
    <div class="row">
      <Checkbox bind:checked={fullscreen} label="Fullscreen" />
    </div>
    {#if !!mediaFile}
      <div class="row">
        <Select
          bind:value={selectedAudioId}
          label="Audio track"
          disabled={!mediaFile || audioStreams.length <= 1}
          items={audioStreams}
        />
      </div>
      <div class="row">
        <Select
          bind:value={selectedSubtitleId}
          label="Subtitle track"
          disabled={!mediaFile || subtitleStreams.length <= 1}
          items={subtitleStreams}
        />
      </div>
    {/if}
  </div>
  <div slot="actions">
    <Button
      on:click={() => handleAction(handlePlay)}
    >
      <span>
        <span class="material-icons">play_arrow</span>
        Play
      </span>
    </Button>
    <Button 
      on:click={() => handleAction(handleAddToPlaylist)}
    >
      <span>
        <span class="material-icons">playlist_add</span>
        Add to playlist
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
