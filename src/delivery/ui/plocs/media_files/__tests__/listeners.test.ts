import { ForkedTask } from "@reduxjs/toolkit";
import { container, Dependencies } from "../../../di";
import { AppListenerEffectAPI } from "../../../reducers";
import { subscribeToMediaFiles } from "../actions";
import { subscribeToMediaFilesEffect } from "../listeners";
import { MediaFilesEvents, MediaFilesRepository } from "../../../../../domains/media_files/interfaces";
import { makeOk } from "src/domains/common/either";
import { MediaFilesMap } from "src/domains/media_files/entities";

describe('media files listeners', () => {
  let listenerApiMock: jest.Mocked<AppListenerEffectAPI>;

  let mediaFilesRepositoryMock: jest.Mocked<MediaFilesRepository>;

  beforeAll(() => {
    mediaFilesRepositoryMock = {
      iterateMediaFiles: jest.fn(),
    };
    listenerApiMock = {
      fork: jest.fn(),
      dispatch: jest.fn(),
      unsubscribe: jest.fn(),
      condition: jest.fn(),
    } as unknown as jest.Mocked<AppListenerEffectAPI>;
    container.bind(Dependencies.MediaFilesRepository).toValue(mediaFilesRepositoryMock);
  });

  beforeEach(() => {
    listenerApiMock.fork.mockReturnValue({
      cancel: jest.fn(),
    } as unknown as jest.Mocked<ForkedTask<unknown>>);
  });

  describe('subscribeToMediaFiles effect', () => {
    it('should fork subscriptions', async () => {
      const iteratorMock: AsyncGenerator<Awaited<{ eventVariant: MediaFilesEvents, payload: MediaFilesMap }>, void, unknown> = {
        next: jest.fn(),
        return: jest.fn(),
        throw: jest.fn(),
        [Symbol.asyncIterator]: jest.fn(),
        [Symbol.asyncDispose]: jest.fn(),
      };
      mediaFilesRepositoryMock.iterateMediaFiles.mockReturnValue(makeOk(iteratorMock));
      const action = subscribeToMediaFiles();

      await subscribeToMediaFilesEffect(action, listenerApiMock);
    
      expect(listenerApiMock.fork).toHaveBeenCalledTimes(1);
    });
  });
});
