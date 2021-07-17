<script lang="ts">
  import SmuiDialog, { Title as DialogTitle, Content as DialogContent, Actions } from '@smui/dialog/styled';
  import type { DialogClosedEvent } from '@smui/dialog/styled';
  import { CommonDialogActions } from '../models/dialogs';

  export let name: string;
  export let opened: boolean;
  export let title: string;
  export let dialogCloseHandler: (() => void) | undefined = undefined;
  export let dialogActionHandler: (action: string) => void;

  function handleClose(event: DialogClosedEvent) {
    if (event.detail.action === CommonDialogActions.Close) {
      !!dialogCloseHandler && dialogCloseHandler();
    } else {
      dialogActionHandler(event.detail.action);
    } 
  }
</script>

{#if opened}
  <SmuiDialog
    bind:open={opened}
    aria-labelledby={`${name}-title`}
    aria-describedby={`${name}-content`}
    on:MDCDialog:closed={handleClose}
  >
    <DialogTitle id={`${name}-title`}>{title}</DialogTitle>
    <DialogContent>
      <div id={`${name}-content`}>
        <slot name="content"></slot>
      </div>
    </DialogContent>
    <Actions>
      <div id={`${name}-actions`}>
        <slot name="actions"></slot>
      </div>
    </Actions>
  </SmuiDialog>
{/if}
