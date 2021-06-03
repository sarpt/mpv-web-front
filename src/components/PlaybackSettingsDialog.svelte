<script lang="ts">
  import {InitialFocus} from '@smui/dialog';
  import Button, {Label, Icon as ButtonIcon} from '@smui/button';
  import Select, {Option} from '@smui/select';

  import { getMovieName, getStreamName } from '../functions/movie';
  import type { Movie, Playback } from '../models/api';
  import { PlaybackSettingsDialogActions } from '../models/dialogs';
  import Dialog from './Dialog.svelte';

  export let opened: boolean;
  export let playback: Playback | undefined;
  export let currentMovie: Movie | undefined;
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
  title={!!currentMovie ? getMovieName(currentMovie) : ''}
  bind:opened={opened}
  dialogActionHandler={handleCloseDialog}
>
  <div slot="content" class="content">
    {#if !!currentMovie && currentMovie.AudioStreams && currentMovie.SubtitleStreams}
      <div class="row">
        <Select
          bind:value={selectedAudioId}
          label="Audio track"
          disabled={!currentMovie || currentMovie.AudioStreams.length <= 1}
        >
          {#each currentMovie.AudioStreams as audioStream}
            <Option value={audioStream.AudioID} selected={selectedAudioId === audioStream.AudioID}>{getStreamName(audioStream)}</Option>
          {/each}
        </Select>
      </div>
      <div class="row">
        <Select
          bind:value={selectedSubtitleId}
          label="Subtitle track"
          disabled={!currentMovie || currentMovie.SubtitleStreams.length <= 1}
        >
          {#each currentMovie.SubtitleStreams as subtitleStream}
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