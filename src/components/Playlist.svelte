<script lang="ts">
  import { changePlaylistIdx } from '../functions/api';

  import { getMediaFileName } from '../functions/media_file';
  import { mediaFilesStore } from '../stores/media_files';
  import { playbackStore } from '../stores/playback';
  import { playlistsStore } from "../stores/playlists";
  import Row from './Row.svelte';

  $: mediaFiles = $mediaFilesStore.mediaFiles;
  $: playlists = $playlistsStore;
  $: playback = $playbackStore.playback;
  $: selected = (idx: number): boolean => {
    return !!playlists && !!playback && idx === playback.PlaylistCurrentIdx;
  }
  $: currentPlaylist = (playback && playback.PlaylistUUID != "") ? playlists.Items[playback.PlaylistUUID] : undefined;

  const handlePlaylistEntryClick = async (idx: number) => {
    return await changePlaylistIdx(idx);
  }
</script>

{#if currentPlaylist && currentPlaylist.Entries.length > 0}
    {#each currentPlaylist.Entries as entry, idx}
      <div class="playlist-entry" on:click={() => handlePlaylistEntryClick(idx)}>
        <Row selected={selected(idx)} odd={idx % 2 !== 1}> 
          <div class="playlist-path" slot="content">
            {getMediaFileName(mediaFiles[entry.Path])}
          </div>
        </Row>
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

  .playlist-path {
    overflow-x: hidden;
    overflow-y: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
