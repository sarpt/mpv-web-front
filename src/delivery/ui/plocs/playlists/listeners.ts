import { fetchPlaylists, playlistsFetched, subscribeToPlaylists, unsubscribeToPlaylists } from "./actions";
import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";

export const fetchPlaylistsEffect = async (_action: ReturnType<typeof fetchPlaylists>, listenerApi: AppListenerEffectAPI) => {
  const repo = resolve(Dependencies.PlaylistsRepository)();
  const playlists = await repo.fetchPlaylists();

  listenerApi.dispatch(playlistsFetched(playlists));
};

const playlistsPollTimeout = 5000;
export const subscribeToPlaylistsEffect = async (_action: ReturnType<typeof subscribeToPlaylists>, listenerApi: AppListenerEffectAPI) => {
    listenerApi.unsubscribe()

    const pollingTask = listenerApi.fork(async (forkApi) => {
      while (true) {
        listenerApi.dispatch(fetchPlaylists());

        await forkApi.delay(playlistsPollTimeout)
      }
    })

    await listenerApi.condition(unsubscribeToPlaylists.match);
    pollingTask.cancel();
}
