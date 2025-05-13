import { playlistsFetched, playlistsFetchError, subscribeToPlaylists, unsubscribeToPlaylists } from "./actions";
import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";
import { PlaylistEvents } from "src/domains/playlists/entities";

export const subscribeToPlaylistsEffect = async (_action: ReturnType<typeof subscribeToPlaylists>, listenerApi: AppListenerEffectAPI) => {
  listenerApi.unsubscribe()

  const repo = resolve(Dependencies.PlaylistsRepository)();
  const playlistsIteratorResult = repo.iteratePlaylists();
  if (playlistsIteratorResult.isErr()) {
    listenerApi.dispatch(playlistsFetchError("could not start subscription to media files events"));
    return;
  }

  const playlistsIterator = playlistsIteratorResult.ok();
  const pollingTask = listenerApi.fork(async () => {
    try {
      for await (const playlistsEvent of playlistsIterator) {
        if (
          playlistsEvent.eventVariant === PlaylistEvents.Added ||
          playlistsEvent.eventVariant === PlaylistEvents.ItemsChange ||
          playlistsEvent.eventVariant === PlaylistEvents.Replay
        ) {
          if (playlistsEvent.payload) listenerApi.dispatch(playlistsFetched(playlistsEvent.payload));
        }
      }
    } catch (err) {
      // print an error since fork swallows thrown errors
      console.error(err);
    }
  })

  await listenerApi.condition(unsubscribeToPlaylists.match);
  pollingTask.cancel();
}
