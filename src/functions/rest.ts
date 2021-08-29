import { apiAddressStore } from '../stores/api_address';
import type { ApiAddressState } from '../stores/api_address';

let address: string | undefined;

apiAddressStore.subscribe(handleApiAddressChange);

function handleApiAddressChange(apiAddressState: ApiAddressState) {
  address = apiAddressState.address;
}

export async function getMediaFiles(): Promise<Response> {
  return await fetch(`http://${address}/rest/media-files`);
}

export async function headMediaFiles(newAddress: string): Promise<Response> {
  return await fetch(`http://${newAddress}/rest/media-files`, {
    method: 'HEAD',
  });
}

export type playbackRequest = {
  append?: boolean,
  audioId?: string,
  fullscreen?: boolean,
  loopFile?: boolean,
  path?: string,
  pause?: boolean,
  playlistIdx?: number,
  subtitleId?: string,
};

enum PlaybackArgurments {
  Append = 'append',
  AudioId = 'audioID',
  Fullscreen = 'fullscreen',
  LoopFile = 'loopFile',
  Path = 'path',
  Pause = 'pause',
  PlaylistIdx = 'playlistIdx',
  SubtitleId = 'subtitleID',
}

export async function postPlayback(request: playbackRequest): Promise<Response> {
  const formData = new FormData();
  if (request.append !== undefined) {
    formData.set(PlaybackArgurments.Append, `${request.append}`);
  }

  if (!!request.path) {
    formData.set(PlaybackArgurments.Path, request.path);
  }

  if (!!request.audioId) {
    formData.set(PlaybackArgurments.AudioId, request.audioId);
  }

  if (!!request.subtitleId) {
    formData.set(PlaybackArgurments.SubtitleId, request.subtitleId);
  }

  if (request.fullscreen !== undefined) {
    formData.set(PlaybackArgurments.Fullscreen, `${request.fullscreen}`);
  }

  if (request.pause !== undefined) {
    formData.set(PlaybackArgurments.Pause, `${request.pause}`);
  }

  if (request.loopFile !== undefined) {
    formData.set(PlaybackArgurments.LoopFile, `${request.loopFile}`);
  }

  if (request.playlistIdx !== undefined) {
    formData.set(PlaybackArgurments.PlaylistIdx, `${request.playlistIdx}`);
  }

  return await fetch(`http://${address}/rest/playback`, {
    method: 'POST',
    body: formData,
  });
}
