<script lang="ts">
  import Paper, { Title } from '@smui/paper';

  import { getMovieName } from '../functions/movie';
  import { moviesStore } from '../stores/movies';
  import { playlistStore } from "../stores/playlist";

  $: movies = $moviesStore.movies;
  $: playlist = $playlistStore.playlist;
  $: getColor = (idx: number): string => {
    return !!playlist && idx === playlist.CurrentIdx ? 'primary' : 'none';
  }
</script>

{#if playlist && playlist.Items.length > 0}
    {#each playlist.Items as item, idx}
      <div class="playlist-entry">
        <Paper transition color={getColor(idx)}>
            <Title>
              <div class="playlist-path">
                {getMovieName(movies[item])}
              </div>
            </Title>
        </Paper>
      </div>
    {/each}
{:else}
  <div>
    There's no current playlist
  </div>
{/if}

<style lang="scss">
  .playlist-entry {
    margin-bottom: 5px;
    cursor: pointer;
  }

  @media (max-width: 640px) {
    :global(.smui-paper) {
      padding: 9px 6px;
    }

    :global(.smui-paper .smui-paper__title) {
      font-size: small;
      line-height: 1em;
      margin-bottom: 0;
    }
  }

  .playlist-path {
    overflow-x: hidden;
    overflow-y: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
