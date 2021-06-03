<script lang="ts">
  import Button, {Label, Icon as ButtonIcon} from '@smui/button';
  import Textfield from '@smui/textfield';

  import { checkApiAvailability } from '../functions/api';
  import { apiAddressStore } from '../stores/api_address';
  import { apiConnectionStore } from '../stores/api_connection';

  import Dialog from './Dialog.svelte';

  export let opened = false;
  $: currentApiAddress = $apiAddressStore;
  let valid = true;
	async function dispatchAddress() {
    valid = await checkApiAvailability(currentApiAddress.address);

    if (valid) {
      apiAddressStore.set({ address: currentApiAddress.address });
      apiConnectionStore.set({ connected: true });
    }
	}
</script>

<Dialog
  name="api-address"
  title="API Address change"
  {opened}
  dialogActionHandler={dispatchAddress}
>
  <div slot="content">
    <span>Movie list could not be fetched from the provided address. Please input a new address:</span>
    <div>
      <Textfield
        invalid={!valid}
        bind:value={currentApiAddress.address}
        label="New address"
      />
    </div>
  </div>
  <div class="retry-button" slot="actions">
    <Button action="ok">
      <ButtonIcon class="material-icons">done</ButtonIcon>
      <Label>OK</Label>
    </Button>
  </div>
</Dialog>

<style>
  .retry-button {
    margin-top: 0.5em;
  }
</style>
