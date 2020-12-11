<script lang="ts">
  import Button, {Label} from '@smui/button';
  import Paper, {Title, Content} from '@smui/paper';
  import Textfield from '@smui/textfield';

  import { checkApiAvailability } from '../functions/api';
  import { apiAddressStore } from '../stores/api_address';
  import { apiConnectionStore } from '../stores/api_connection';

  let currentApiAddress = $apiAddressStore;
  let valid = true;
	async function dispatchAddress() {
    valid = await checkApiAvailability(currentApiAddress.address);

    if (valid) {
      apiAddressStore.set({ address: currentApiAddress.address });
      apiConnectionStore.set({ connected: true });
    }
	}
</script>

<Paper transition elevation={1}>
  <Title>API Address change</Title>
  <Content>
    <span>Movie list could not be fetched from the provided address. Please input a new address:</span>
    <div>
      <Textfield invalid={!valid} bind:value={currentApiAddress.address} label="New address"/>
    </div>
    <div class="retry-button">
      <Button on:click={dispatchAddress} variant="raised" >
        <Label>Retry</Label>
      </Button>
    </div>
  </Content>
</Paper>

<style>
  .retry-button {
    margin-top: 0.5em;
  }
</style>
