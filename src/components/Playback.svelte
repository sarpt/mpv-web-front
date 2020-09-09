<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import LinearProgress from '@smui/linear-progress';

  import type { Playback } from "../functions/api";
  import { secondsToHHMMSS } from "../functions/time";
  import { getMovieName } from "../functions/movie";
  import { playbackStore } from '../stores/playback';

  import './Playback.scss';

  let playback: Playback | undefined;

  $: playingMovieProgress = (!!playback && playback.Movie.Duration > 0) ? (playback.CurrentTime / playback.Movie.Duration) : 0;

  function updatePlayback(updatedPlayback: Playback | undefined) {
    playback = updatedPlayback;
  }

  const playbackUnsubscribe = playbackStore.subscribe(playbackState => {
    updatePlayback(playbackState.playback);
  });

  onDestroy(() => {
    playbackUnsubscribe();
  });
</script>

<div>
  {#if !!playback}
    <div>
      Name: {getMovieName(playback.Movie)}
      <div class="progress-container">
        <span>{secondsToHHMMSS(playback.CurrentTime)}-{secondsToHHMMSS(playback.Movie.Duration)}</span>
        <LinearProgress class="playback-progress" progress={playingMovieProgress} />
      </div>
    </div>
  {:else}
    No playback
  {/if}
</div>

<style lang="scss">
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