import { fetchPlaylists, playlistsFetched, subscribeToPlaylists, unsubscribeToPlaylists } from "./actions";
import {
  resolve,
  Dependencies
} from '../../di';
import { AppListenerEffectAPI } from "../../reducers";

export const fetchPlaylistsEffect = async (action: ReturnType<typeof fetchPlaylists>, listenerApi: AppListenerEffectAPI) => {
  const fetchPlaylistsUC = resolve(Dependencies.FetchPlaylistsUC)();
  const { playlists } = await fetchPlaylistsUC.invoke();

  listenerApi.dispatch(playlistsFetched(playlists));
};

const playlistsPollTimeout = 5000;
export const subscribeToPlaylistsEffect = async (action: ReturnType<typeof subscribeToPlaylists>, listenerApi: AppListenerEffectAPI) => {
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
