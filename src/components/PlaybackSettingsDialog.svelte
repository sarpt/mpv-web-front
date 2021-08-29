<script lang="ts">
  import {InitialFocus} from '@smui/dialog/styled';
  import Button, {Label, Icon as ButtonIcon} from '@smui/button/styled';
  import Select, {Option} from '@smui/select/styled';

  import { getMediaFileName, getStreamName } from '../functions/media_file';
  import type { MediaFile, Playback } from '../models/api';
  import { PlaybackSettingsDialogActions } from '../models/dialogs';
  import Dialog from './Dialog.svelte';

  export let opened: boolean;
  export let playback: Playback | undefined;
  export let currentMediaFile: MediaFile | undefined;
  export let dialogCloseHandler: (action: string, audioId: string, subtitleId: string) => void;

  let selectedAudioId = '';
  let selectedSubtitleId = '';

  $: {
    if (!opened) {
      selectedAudioId = playback?.SelectedAudioID || '';
      selectedSubtitleId = playback?.SelectedSubtitleID || '';
    }
  }

  function handleCloseDialog(action: string) {
    dialogCloseHandler(action, selectedAudioId, selectedSubtitleId);
  }
</script>

<Dialog
  name="playback-settings-dialog"
  title={!!currentMediaFile ? getMediaFileName(currentMediaFile) : ''}
  bind:opened={opened}
  dialogActionHandler={handleCloseDialog}
>
  <div slot="content" class="content">
    {#if !!currentMediaFile && currentMediaFile.AudioStreams && currentMediaFile.SubtitleStreams}
      <div class="row">
        <Select
          bind:value={selectedAudioId}
          label="Audio track"
          disabled={!currentMediaFile || currentMediaFile.AudioStreams.length <= 1}
        >
          {#each currentMediaFile.AudioStreams as audioStream}
            <Option value={audioStream.AudioID} selected={selectedAudioId === audioStream.AudioID}>{getStreamName(audioStream)}</Option>
          {/each}
        </Select>
      </div>
      <div class="row">
        <Select
          bind:value={selectedSubtitleId}
          label="Subtitle track"
          disabled={!currentMediaFile || currentMediaFile.SubtitleStreams.length <= 1}
        >
          {#each currentMediaFile.SubtitleStreams as subtitleStream}
            <Option value={subtitleStream.SubtitleID} selected={selectedSubtitleId === subtitleStream.SubtitleID}>{getStreamName(subtitleStream)}</Option>
          {/each}
        </Select>
      </div>
    {/if}
  </div>
  <div slot="actions">
    <Button action={PlaybackSettingsDialogActions.Apply} default use={[InitialFocus]}>
      <ButtonIcon class="material-icons">check</ButtonIcon>
      <Label>Apply</Label>
    </Button>
  </div>
</Dialog>

<style lang="scss">
  .content, .row {
    display: flex;
    flex-direction: column;
  }
</style>