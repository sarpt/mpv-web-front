<script lang="typescript">
  import Dialog, {Title as DialogTitle, Content as DialogContent, Actions, InitialFocus} from '@smui/dialog';
  import Button, {Label, Icon as ButtonIcon} from '@smui/button';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import Radio from '@smui/radio';
  import Select, {Option} from '@smui/select';
  import SelectIcon from '@smui/select/icon/index';

  import { getMovieName, getStreamName } from '../functions/movie';

  import type { Movie, AudioStream, SubtitleStream } from '../functions/api';

  export let dialogCloseHandler: (action: string, fullscreen: boolean, audioId: string, subtitleId: string) => void;
  export let movie: Movie | undefined;
  export let opened: boolean = false;

  let eventDialog: Dialog;
  let fullscreen: boolean = false;
  let selectedAudioId = '';
  let selectedSubtitleId = '';

  type DialogClosedEvent = {
    detail: {
      action: string
    }
  };

  $: if (opened && eventDialog && !eventDialog.isOpen()) {
    selectedAudioId = movie?.AudioStreams[0]?.AudioID || '';
    selectedSubtitleId = movie?.SubtitleStreams[0]?.SubtitleID || '';
    eventDialog.open();
  } else if (!opened && eventDialog && eventDialog.isOpen()) {
    eventDialog.close();
  }

  $: handleClose = (event: DialogClosedEvent) => {
    dialogCloseHandler(event.detail.action, fullscreen, selectedAudioId, selectedSubtitleId);
  }

  function invalidSelectedAudio(audio: AudioStream | undefined, movie: Movie | undefined): boolean {
    if (!audio || !movie) return true;

    return !movie.AudioStreams.some(audioStream => audioStream === audio);
  }

  function invalidSelectedSubtitle(subtitle: SubtitleStream | undefined, movie: Movie | undefined): boolean {
    if (!subtitle || !movie) return true;

    return !movie.SubtitleStreams.some(subtitleStream => subtitleStream === subtitle);
  }
</script>

<Dialog
  bind:this={eventDialog}
  aria-labelledby="movie-dialog-title"
  aria-describedby="movie-dialog-content"
  on:MDCDialog:closed={handleClose}
>
  <DialogTitle id="movie-dialog-title">{!!movie && getMovieName(movie)}</DialogTitle>
  <DialogContent>
    <div id="movie-dialog-content">
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
    <Button action="play" default use={[InitialFocus]}>
      <ButtonIcon class="material-icons">play_arrow</ButtonIcon>
      <Label>Play</Label>
    </Button>
    <Button action="add">
      <ButtonIcon class="material-icons">playlist_add</ButtonIcon>
      <Label>Add to playlist</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  #movie-dialog-content {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: column;
  }
</style>
