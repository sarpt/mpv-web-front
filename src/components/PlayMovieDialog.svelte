<script lang="typescript">
  import {InitialFocus} from '@smui/dialog/styled';
  import Button, {Label, Icon as ButtonIcon} from '@smui/button/styled';
  import Checkbox from '@smui/checkbox/styled';
  import FormField from '@smui/form-field/styled';
  import Select, {Option} from '@smui/select/styled';

  import { getMovieName, getStreamName } from '../functions/movie';

  import type { Movie } from '../models/api';
  import { MovieDialogActions } from '../models/dialogs';
  import Dialog from './Dialog.svelte';

  export let dialogCloseHandler: (action: string, fullscreen: boolean, audioId: string, subtitleId: string) => void;
  export let movie: Movie | undefined;
  export let opened: boolean;
  export let selectedAudioId = '';
  export let selectedSubtitleId = '';

  let fullscreen: boolean = false;

  function handleAction(action: string) {
    dialogCloseHandler(action, fullscreen, selectedAudioId, selectedSubtitleId);
  }
</script>

<Dialog
  name='movie-dialog'
  bind:opened={opened}
  title={!!movie ? getMovieName(movie) : ''}
  dialogActionHandler={handleAction}
>
  <div class="content" slot="content">
    <div class="row">
      <FormField>
        <Checkbox bind:checked={fullscreen} />
        <span slot="label">Fullscreen</span>
      </FormField>
    </div>
    {#if !!movie}
      <div class="row">
        <Select
          bind:value={selectedAudioId}
          label="Audio track"
          disabled={!movie || movie.AudioStreams.length <= 1}
        >
          {#if movie.AudioStreams.length < 1}
            <Option value="" />
          {:else}
            {#each movie.AudioStreams as audioStream}
              <Option value={audioStream.AudioID}>{getStreamName(audioStream)}</Option>
            {/each}
          {/if}
        </Select>
      </div>
      <div class="row">
        <Select
          bind:value={selectedSubtitleId}
          label="Subtitle track"
          disabled={!movie || movie.SubtitleStreams.length <= 1}
        >
          {#if movie.SubtitleStreams.length < 1}
            <Option value="" />
          {:else}
            {#each movie.SubtitleStreams as subtitleStream}
              <Option value={subtitleStream.SubtitleID}>{getStreamName(subtitleStream)}</Option>
            {/each}
          {/if}
        </Select>
      </div>
    {/if}
  </div>
  <div slot="actions">
    <Button action={MovieDialogActions.Play} default use={[InitialFocus]}>
      <ButtonIcon class="material-icons">play_arrow</ButtonIcon>
      <Label>Play</Label>
    </Button>
    <Button action={MovieDialogActions.Added}>
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
