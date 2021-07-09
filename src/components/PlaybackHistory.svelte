<script lang="ts">
  import { onDestroy } from 'svelte';
  import Paper, { Title } from '@smui/paper/styled';
  import { getMovieName } from '../functions/movie';
  import Loading  from './Loading.svelte';

  import { getPlaybackHistory, playbackHistoryChanges } from '../functions/playback_history';

  let playbackHistory = getPlaybackHistory();

  const subscription = playbackHistoryChanges().subscribe(async () => {
    playbackHistory = getPlaybackHistory(); // TODO: reimplement to using changes instead of fetching the whole state every time (svelte store?)
  });

  onDestroy(() => {
    subscription.unsubscribe();
  }); 
</script>

{#await playbackHistory}
  <Loading />
{:then playbackHistory} 
  {#if playbackHistory.length > 0}
    {#each playbackHistory as entry, idx}
      <div class="movie-entry" on:click={() => {}}>
        <Paper transition>
          <Title>
            <div class="movie-title">
              {getMovieName(entry)}
            </div>
          </Title>
        </Paper>
      </div>
    {/each}
  {:else}
    <div>
      No playback history
    </div>
  {/if}
{/await}

<style lang="scss">
  .movie-entry {
    margin-bottom: 5px;
    cursor: pointer;
  }

  .movie-title {
    overflow-x: hidden;
    overflow-y: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
