<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Button, {Label} from '@smui/button';
  import Paper, {Title, Content} from '@smui/paper';
  import Textfield from '@smui/textfield';
	
  const dispatch = createEventDispatcher();
  
  export let address: string;

	function dispatchAddress() {
		dispatch('address-change', {
			address 
		});
	}
</script>

<Paper transition elevation={1}>
  <Title>API Address change</Title>
  <Content>
    <span>Movie list could not be fetched from the provided address. Please input a new address:</span>
    <div>
      <Textfield bind:value={address} label="New address"/>
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
