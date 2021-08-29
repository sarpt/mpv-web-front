import { mediaFilesStore } from '../stores/media_files';
import { getMediaFiles, headMediaFiles, postPlayback } from './rest';

export async function checkApiAvailability(newAddress: string): Promise<boolean> {
  try {
    await headMediaFiles(newAddress);

    return true;
  } catch (err) {
    return false;
  }
}

export type playMediaFileArguments = {
  append: boolean,
  audioId?: string,
  fullscreen: boolean,
  path: string,
  pause: boolean,
  subtitleId?: string,
};

export async function changeMediaFile(mediaFile: playMediaFileArguments): Promise<boolean> {
  try {
    await postPlayback(mediaFile);

    return true;
  } catch (err) {
    return false;
  }
}

export async function pause(paused: boolean): Promise<boolean> {
  try {
    await postPlayback({
      pause: paused,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function changeAudio(audioId: string | undefined): Promise<boolean> {
  try {
    await postPlayback({
      audioId,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function changeSubtitles(subtitleId: string | undefined): Promise<boolean> {
  try {
    await postPlayback({
      subtitleId,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function changePlaylistIdx(playlistIdx: number): Promise<boolean> {
  try {
    await postPlayback({
      playlistIdx,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function fullscreen(enabled: boolean): Promise<boolean> {
  try {
    await postPlayback({
      fullscreen: enabled,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchAllMediaFiles() {
  try {
    mediaFilesStore.set({
      mediaFiles: {},
      isFetchingInProgress: true,
    });

    const res = await getMediaFiles();
    const mediaFilesResponse = await res.json();

    mediaFilesStore.set({
      mediaFiles: mediaFilesResponse.mediaFiles || {},
      isFetchingInProgress: false,
    });
  } catch(err) {
    mediaFilesStore.set({
      mediaFiles: {},
      isFetchingInProgress: false,
    });
  }
}
