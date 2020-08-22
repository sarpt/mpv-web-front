<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Button, {Label} from '@smui/button';
  import Paper, {Title, Content} from '@smui/paper';
  import Textfield from '@smui/textfield';
  
  import { apiAddress } from '../stores/api_address';

  let currentApiAddress = $apiAddress;

	function dispatchAddress() {
    apiAddress.set({ address: currentApiAddress.address });
	}
</script>

<Paper transition elevation={1}>
  <Title>API Address change</Title>
  <Content>
    <span>Movie list could not be fetched from the provided address. Please input a new address:</span>
    <div>
      <Textfield bind:value={currentApiAddress.address} label="New address"/>
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
