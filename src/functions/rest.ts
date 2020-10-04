import { apiAddressStore } from '../stores/api_address';
import type { ApiAddressState } from '../stores/api_address';

let address: string | undefined;

apiAddressStore.subscribe(handleApiAddressChange);

function handleApiAddressChange(apiAddressState: ApiAddressState) {
  address = apiAddressState.address;
}

export async function getMovies(): Promise<Response> {
  return await fetch(`http://${address}/movies`);
}

export async function headMovies(newAddress: string): Promise<Response> {
  return await fetch(`http://${newAddress}/movies`, {
    method: 'HEAD',
  });
}

export type playbackRequest = {
  path?: string,
  fullscreen?: boolean,
  audioId?: string,
  subtitleId?: string,
  pause?: boolean,
};

export async function postPlayback(request: playbackRequest): Promise<Response> {
  const formData = new FormData();
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

  return await fetch(`http://${address}/playback`, {
    method: 'POST',
    body: formData,
  });
}
