<script lang="ts">
  import Dialog, {Title as DialogTitle, Content as DialogContent, Actions, InitialFocus} from '@smui/dialog';
  import type {DialogClosedEvent} from '@smui/dialog';
  import Button, {Label, Icon as ButtonIcon} from '@smui/button';
  import Radio from '@smui/radio';
  import FormField from '@smui/form-field';
  import { LoopVariant } from '../models/api';

  export let opened: boolean;
  export let initialLoopVariant: LoopVariant;
  export let dialogCloseHandler: (action: string, loopVariant: LoopVariant) => void;

  let eventDialog: Dialog;
  let selectedLoopVariant: LoopVariant;
  $: selectedLoopVariant = initialLoopVariant;

  $: if (opened && eventDialog && !eventDialog.isOpen()) {
    eventDialog.open();
  } else if (!opened && eventDialog && eventDialog.isOpen()) {
    eventDialog.close();
  }

  const handleCloseDialog = (ev: DialogClosedEvent) => {
    opened = false;
    dialogCloseHandler(ev.detail.action, selectedLoopVariant);
  }
</script>

<Dialog
  bind:this={eventDialog}
  aria-labelledby="repeat-dialog-title"
  aria-describedby="repeat-dialog-content"
  on:MDCDialog:closed={handleCloseDialog}
>
  <DialogTitle id="repeat-dialog-title">Repeat options</DialogTitle>
  <DialogContent>
    <div id="repeat-dialog-content">
      <FormField>
        <Radio bind:group={selectedLoopVariant} value={LoopVariant.File} />
        <span slot="label">
          Currently playing
        </span>
      </FormField>
      <FormField>
        <Radio bind:group={selectedLoopVariant} value={LoopVariant.Playlist} disabled={true}/>
        <span slot="label">
          Playlist
        </span>
      </FormField>
      <FormField>
        <Radio bind:group={selectedLoopVariant} value={LoopVariant.AB} disabled={true}/>
        <span slot="label">
          A-B
        </span>
      </FormField>
      <FormField>
        <Radio bind:group={selectedLoopVariant} value={LoopVariant.Off} />
        <span slot="label">
          Off
        </span>
      </FormField>
    </div>
  </DialogContent>
  <Actions>
    <Button action="play" default use={[InitialFocus]}>
      <ButtonIcon class="material-icons">play_arrow</ButtonIcon>
      <Label>Play</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  #repeat-dialog-content {
    display: flex;
    flex-direction: column;
  }
</style>
