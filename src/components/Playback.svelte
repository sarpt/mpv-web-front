<script lang="ts">
  import { onMount } from "svelte";

  import LinearProgress from '@smui/linear-progress';

  import { subscribeToPlaybackChanges } from "../functions/api";
  import type { Playback } from "../functions/api";
  import { secondsToHHMMSS } from "../functions/time";
  import { getMovieName } from "../functions/movie";

  import './Playback.scss';

  let playback: Playback | undefined;

  $: playingMovieProgress = (!!playback && playback.Movie.Duration > 0) ? (playback.CurrentTime / playback.Movie.Duration) : 0;

  function updatePlayback(updatedPlayback: Playback) {
    playback = updatedPlayback;
  }

  function handleConnectionError() {}

  onMount(() => {
    subscribeToPlaybackChanges({ playbackEventHandler: updatePlayback, errorHandler: handleConnectionError });
  });
</script>

<div>
  {#if !!playback}
    <div>
      Name: {getMovieName(playback.Movie)}
      <div class="progress-container">
        <span>{secondsToHHMMSS(playback.CurrentTime)}-{secondsToHHMMSS(playback.Movie.Duration)}</span>
        <LinearProgress class="my-colored-bar" progress={playingMovieProgress} />
      </div>
    </div>
  {:else}
    No playback
  {/if}
</div>

<style lang="scss">
  .linear-progress {
    width: 100%;
    height: 100%;
    background-color: none;
    padding: 1 1;
  }

  .progress-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    
    > span {
      flex-shrink: 0;
      flex-grow: 0;
      margin-right: 0.5rem;
    }
  }
</style>