<script lang="ts">
  import Paper, { Title } from '@smui/paper';

  import { getMovieName } from '../functions/movie';
  import { moviesStore } from '../stores/movies';
  import { playbackStore } from '../stores/playback';
  import { playlistsStore } from "../stores/playlists";

  $: movies = $moviesStore.movies;
  $: playlists = $playlistsStore;
  $: playback = $playbackStore.playback;
  $: getColor = (idx: number): string => {
    return !!playlists && !!playback && idx === playback.PlaylistCurrentIdx ? 'primary' : 'none';
  }
  $: currentPlaylist = (playback && playback.PlaylistUUID != "") ? playlists.Items[playback.PlaylistUUID] : undefined;
</script>

{#if currentPlaylist && currentPlaylist.Items.length > 0}
    {#each currentPlaylist.Items as item, idx}
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
