<script lang="ts">
  import {InitialFocus} from '@smui/dialog/styled';
  import Button, {Label, Icon as ButtonIcon} from '@smui/button/styled';
  import Radio from '@smui/radio/styled';
  import FormField from '@smui/form-field/styled';
  import { LoopVariant } from '../models/api';
  import { PlaybackRepeatDialogActions } from '../models/dialogs';
  import Dialog from './Dialog.svelte';

  export let opened: boolean;
  export let initialLoopVariant: LoopVariant;
  export let dialogCloseHandler: (action: string, loopVariant: LoopVariant) => void;

  let selectedLoopVariant: LoopVariant;
  $: selectedLoopVariant = initialLoopVariant;

  const handleActions = (action: string) => {
    dialogCloseHandler(action, selectedLoopVariant);
  }

  const handleClose = () => {
    selectedLoopVariant = initialLoopVariant;
  }
</script>

<Dialog
  name="repeat-dialog"
  bind:opened={opened}
  title="Repeat options"
  dialogActionHandler={handleActions}
  dialogCloseHandler={handleClose}
>
  <div slot="content" class="content">
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
  <div slot="actions">
    <Button action={PlaybackRepeatDialogActions.Apply} default use={[InitialFocus]} disabled={initialLoopVariant === selectedLoopVariant}>
      <ButtonIcon class="material-icons">check</ButtonIcon>
      <Label>Apply</Label>
    </Button>
  </div>
</Dialog>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
  }
</style>
