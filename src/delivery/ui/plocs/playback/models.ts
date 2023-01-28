import * as Entities from '../../../../domains/playback/entities';

export enum LoopVariant {
  File = 'file',
  Playlist = 'playlist',
  AB = 'ab',
  Off = 'off',
}

export type Playback = Entities.Playback;
