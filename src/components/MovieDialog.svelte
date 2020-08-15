<script lang="typescript">
  import Dialog, {Title as DialogTitle, Content as DialogContent, Actions, InitialFocus} from '@smui/dialog';
  import Button, {Label, Icon as ButtonIcon} from '@smui/button';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import Radio from '@smui/radio';
  import Select, {Option} from '@smui/select';
  import SelectIcon from '@smui/select/icon/index';

  import { getMovieName } from '../functions/movie';

  import MovieDialog from './MovieDialog.svelte';
  import type { Movie, AudioStream, SubtitleStream } from '../functions/api';

  export let eventDialog: any;
  export let dialogCloseHandler: (action: string, fullscreen: boolean, audio: AudioStream, subtitle: SubtitleStream) => void;
  export let movie: Movie | undefined;
  let fullscreen: boolean = false;
  let selectedAudio: AudioStream | undefined;
  let selectedSubtitle: SubtitleStream | undefined;

  $: if (invalidSelectedAudio(selectedAudio, movie)) selectedAudio = movie?.AudioStreams[0];
  $: if (invalidSelectedSubtitle(selectedSubtitle, movie)) selectedSubtitle = movie?.SubtitleStreams[0];

  type DialogClosedEvent = {
    detail: {
      action: string
    }
  };

  $: handleClose = (event: DialogClosedEvent) => {
    dialogCloseHandler(event.detail.action, fullscreen, selectedAudio!, selectedSubtitle!);
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
  <DialogTitle id="movie-dialog-title">{!!movie && getMovieName(movie.Path)}</DialogTitle>
  <DialogContent id="movie-dialog-content">
    <div class="row">
      <FormField>
        <Checkbox bind:checked={fullscreen} />
        <span slot="label">Fullscreen</span>
      </FormField>
    </div>
    {#if !!movie}
      <div class="row">
        <span>Audio track</span>
        <div class="row-controls">
          {#each movie.AudioStreams as audioStream}
            <FormField>
              <Radio bind:group={selectedAudio} value={audioStream} />
              <span slot="label">{audioStream.Language}</span>
            </FormField>
          {/each}
        </div>
      </div>
      <div class="row">
        <span>Subtitle track</span>
        <div class="row-controls">
          {#each movie.SubtitleStreams as subtitleStream}
            <FormField>
              <Radio bind:group={selectedSubtitle} value={subtitleStream} />
              <span slot="label">{subtitleStream.Language}</span>
            </FormField>
          {/each}
        </div>
      </div>
    {/if}
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

  .row-controls {
    display: flex;
    flex-direction: row;
  }
</style>
