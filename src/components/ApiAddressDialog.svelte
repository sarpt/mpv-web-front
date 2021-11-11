<script lang="ts">
  import {
    Button,
    Dialog,
    TextField,
  } from 'smelte';

  import { checkApiAvailability } from '../functions/api';
  import { apiAddressStore } from '../stores/api_address';
  import { apiConnectionStore } from '../stores/api_connection';

  export let opened = false;
  $: currentApiAddress = $apiAddressStore;
  let valid = true;
  let err: string | undefined;
  $: if (!valid) {
    err = 'Incorrect address'; 
  }

	async function dispatchAddress() {
    valid = await checkApiAvailability(currentApiAddress.address);

    if (valid) {
      apiAddressStore.set({ address: currentApiAddress.address });
      apiConnectionStore.set({ connected: true });
      opened = false
    }
	}
</script>

<Dialog
  name="api-address"
  bind:value={opened}
>
  <div slot=title>
    <span>API Address change</span>
  </div>
  <div slot="default">
    <span>Media files list could not be fetched from the provided address. Please input a new address:</span>
    <div>
      <TextField
        error={err}
        bind:value={currentApiAddress.address}
        label="New address"
      />
    </div>
  </div>
  <div class="retry-button" slot="actions">
    <Button
      on:click={() => dispatchAddress()}
    >
      <span>
        <span class="material-icons">done</span>
        OK
      </span>
    </Button>
  </div>
</Dialog>

<style>
  .retry-button {
    margin-top: 0.5em;
  }
</style>
