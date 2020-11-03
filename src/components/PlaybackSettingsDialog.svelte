<script lang="ts">
  import Dialog, {Title as DialogTitle, Content as DialogContent, Actions, InitialFocus} from '@smui/dialog';
  import type {DialogClosedEvent} from '@smui/dialog';
  import Button, {Label, Icon as ButtonIcon} from '@smui/button';
  import Select, {Option} from '@smui/select';

  import { getMovieName, getStreamName } from '../functions/movie';
  import type { Movie, Playback } from '../models/api';
  import { PlaybackSettingsDialogActions } from '../models/dialogs';

  export let opened: boolean;
  export let playback: Playback | undefined;
  export let dialogCloseHandler: (action: string, audioId: string, subtitleId: string) => void;

  let eventDialog: Dialog;
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

  $: if (opened && eventDialog && !eventDialog.isOpen()) {
    eventDialog.open();
  } else if (!opened && eventDialog && eventDialog.isOpen()) {
    eventDialog.close();
  }

  function handleCloseDialog(event: DialogClosedEvent) {
    dialogCloseHandler(event.detail.action, selectedAudioId, selectedSubtitleId);
    opened = false;
  }
</script>

<Dialog
  bind:this={eventDialog}
  aria-labelledby="movie-dialog-title"
  aria-describedby="movie-dialog-content"
  on:MDCDialog:closed={handleCloseDialog}
>
  <DialogTitle id="movie-dialog-title">{!!playback?.Movie && getMovieName(playback.Movie)}</DialogTitle>
  <DialogContent>
    <div id="playback-settings-dialog-content">
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
  </DialogContent>
  <Actions>
    <Button action={PlaybackSettingsDialogActions.Apply} default use={[InitialFocus]}>
      <ButtonIcon class="material-icons">check</ButtonIcon>
      <Label>Apply</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  #playback-settings-dialog-content {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: column;
  }
</style>