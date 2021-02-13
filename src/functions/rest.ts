import { apiAddressStore } from '../stores/api_address';
import type { ApiAddressState } from '../stores/api_address';

let address: string | undefined;

apiAddressStore.subscribe(handleApiAddressChange);

function handleApiAddressChange(apiAddressState: ApiAddressState) {
  address = apiAddressState.address;
}

export async function getMovies(): Promise<Response> {
  return await fetch(`http://${address}/rest/movies`);
}

export async function headMovies(newAddress: string): Promise<Response> {
  return await fetch(`http://${newAddress}/rest/movies`, {
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
  subtitleId?: string,
};

export async function postPlayback(request: playbackRequest): Promise<Response> {
  const formData = new FormData();
  if (request.append !== undefined) {
    formData.set('append', `${request.append}`);
  }

  if (!!request.path) {
    formData.set('path', request.path);
  }

  if (!!request.audioId) {
    formData.set('audioID', request.audioId);
  }

  if (!!request.subtitleId) {
    formData.set('subtitleID', request.subtitleId);
  }

  if (request.fullscreen !== undefined) {
    formData.set('fullscreen', `${request.fullscreen}`);
  }

  if (request.pause !== undefined) {
    formData.set('pause', `${request.pause}`);
  }

  if (request.loopFile !== undefined) {
    formData.set('loopFile', `${request.loopFile}`);
  }

  return await fetch(`http://${address}/rest/playback`, {
    method: 'POST',
    body: formData,
  });
}
