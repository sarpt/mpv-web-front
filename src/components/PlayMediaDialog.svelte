<script lang="typescript">
  import {InitialFocus} from '@smui/dialog/styled';
  import Button, {Label, Icon as ButtonIcon} from '@smui/button/styled';
  import Checkbox from '@smui/checkbox/styled';
  import FormField from '@smui/form-field/styled';
  import Select, {Option} from '@smui/select/styled';

  import { getMediaFileName, getStreamName } from '../functions/media_file';

  import type { MediaFile } from '../models/api';
  import { MediaFileDialogActions } from '../models/dialogs';
  import Dialog from './Dialog.svelte';

  export let dialogCloseHandler: (action: string, fullscreen: boolean, audioId: string, subtitleId: string) => void;
  export let mediaFile: MediaFile | undefined;
  export let opened: boolean;
  export let selectedAudioId = '';
  export let selectedSubtitleId = '';

  let fullscreen: boolean = false;

  function handleAction(action: string) {
    dialogCloseHandler(action, fullscreen, selectedAudioId, selectedSubtitleId);
  }
</script>

<Dialog
  name='media-file-dialog'
  bind:opened={opened}
  title={!!mediaFile ? getMediaFileName(mediaFile) : ''}
  dialogActionHandler={handleAction}
>
  <div class="content" slot="content">
    <div class="row">
      <FormField>
        <Checkbox bind:checked={fullscreen} />
        <span slot="label">Fullscreen</span>
      </FormField>
    </div>
    {#if !!mediaFile}
      <div class="row">
        <Select
          bind:value={selectedAudioId}
          label="Audio track"
          disabled={!mediaFile || mediaFile.AudioStreams.length <= 1}
        >
          {#if mediaFile.AudioStreams.length < 1}
            <Option value="" />
          {:else}
            {#each mediaFile.AudioStreams as audioStream}
              <Option value={audioStream.AudioID}>{getStreamName(audioStream)}</Option>
            {/each}
          {/if}
        </Select>
      </div>
      <div class="row">
        <Select
          bind:value={selectedSubtitleId}
          label="Subtitle track"
          disabled={!mediaFile || mediaFile.SubtitleStreams.length <= 1}
        >
          {#if mediaFile.SubtitleStreams.length < 1}
            <Option value="" />
          {:else}
            {#each mediaFile.SubtitleStreams as subtitleStream}
              <Option value={subtitleStream.SubtitleID}>{getStreamName(subtitleStream)}</Option>
            {/each}
          {/if}
        </Select>
      </div>
    {/if}
  </div>
  <div slot="actions">
    <Button action={MediaFileDialogActions.Play} default use={[InitialFocus]}>
      <ButtonIcon class="material-icons">play_arrow</ButtonIcon>
      <Label>Play</Label>
    </Button>
    <Button action={MediaFileDialogActions.Added}>
      <ButtonIcon class="material-icons">playlist_add</ButtonIcon>
      <Label>Add to playlist</Label>
    </Button>
  </div>
</Dialog>

<style lang="scss">
  .content, .row {
    display: flex;
    flex-direction: column;
  }
</style>
