<script lang="ts">
  import {
    Button,
    Dialog,
    RadioButton
  } from 'smelte';
  import { LoopVariant } from '../models/api';

  export let opened: boolean;
  export let initialLoopVariant: LoopVariant;
  export let dialogCloseHandler: (loopVariant: LoopVariant) => void;

  let selectedLoopVariant: LoopVariant;
  $: selectedLoopVariant = initialLoopVariant;

  const handleActions = () => {
    dialogCloseHandler(selectedLoopVariant);
    selectedLoopVariant = initialLoopVariant;
    opened = false;
  }
</script>

<Dialog
  name="repeat-dialog"
  bind:value={opened}
>
  <div slot="title">
    <span>Repeat options</span>
  </div>
  <div slot="default" class="content">
      <RadioButton label='Currently playing' bind:selected={selectedLoopVariant} value={LoopVariant.File} />
      <RadioButton label='Playlist' bind:selected={selectedLoopVariant} value={LoopVariant.Playlist} disabled={true}/>
      <RadioButton label='A-B' bind:selected={selectedLoopVariant} value={LoopVariant.AB} disabled={true}/>
      <RadioButton label='Off' bind:selected={selectedLoopVariant} value={LoopVariant.Off} />
  </div>
  <div slot="actions">
    <Button
      on:click={() => handleActions()}
      disabled={initialLoopVariant === selectedLoopVariant}
    >
      <span>
        <span class="material-icons">check</span>
        Apply
      </span>
    </Button>
  </div>
</Dialog>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
  }
</style>
