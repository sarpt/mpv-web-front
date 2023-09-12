import { useSelector } from 'react-redux';
import { selectPlaylistUuid } from '../../playback/selectors';
import { useMemo } from 'react';
import { selectPlaylists } from '../selectors';

export const useSelectedPlaylist = () => {
    const uuid = useSelector(selectPlaylistUuid);
    const playlists = useSelector(selectPlaylists);

    return useMemo(() => {
        if (!uuid) return;

        return playlists[uuid];
    }, [uuid, playlists]);
};