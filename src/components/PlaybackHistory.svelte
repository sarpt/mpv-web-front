<script lang="ts">
  import Paper, { Title } from '@smui/paper';
  import { getMovieName } from '../functions/movie';

  import { getPlaybackHistory } from '../functions/playback_history';
</script>

{#await getPlaybackHistory()}
  Loading...
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
      Seems there is no playback history
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
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
