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
  export let dialogCloseHandler: (action: string, audioId: string, subtitleId: string) => void;

  let selectedAudioId = '';
  let selectedSubtitleId = '';
  let movie: Movie | undefined;

  $: {
    const previousMovie = movie;
    movie = playback?.Movie;
    if (previousMovie?.Path !== movie?.Path || !previousMovie) {
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
  title={!!movie ? getMovieName(movie) : ''}
  bind:opened={opened}
  dialogActionHandler={handleCloseDialog}
>
  <div slot="content" class="content">
    {#if !!movie && movie.AudioStreams && movie.SubtitleStreams}
      <div class="row">
        <Select
          bind:value={selectedAudioId}
          label="Audio track"
          disabled={!movie || movie.AudioStreams.length <= 1}
        >
          {#each movie.AudioStreams as audioStream}
            <Option value={audioStream.AudioID} selected={selectedAudioId === audioStream.AudioID}>{getStreamName(audioStream)}</Option>
          {/each}
        </Select>
      </div>
      <div class="row">
        <Select
          bind:value={selectedSubtitleId}
          label="Subtitle track"
          disabled={!movie || movie.SubtitleStreams.length <= 1}
        >
          {#each movie.SubtitleStreams as subtitleStream}
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