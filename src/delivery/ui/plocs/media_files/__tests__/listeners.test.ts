import { ForkedTask } from "@reduxjs/toolkit";
import { container, Dependencies } from "../../../di";
import { AppListenerEffectAPI } from "../../../reducers";
import { fetchMediaFiles, subscribeToMediaFiles, mediaFilesFetched } from "../actions";
import { fetchMediaFilesEffect, subscribeToMediaFilesEffect } from "../listeners";
import { MediaFilesRepository } from "../../../../../domains/media_files/interfaces";
import { makeOk } from "src/domains/common/either";
import { MediaFilesMap } from "src/domains/media_files/entities";

describe('media files listeners', () => {
  let listenerApiMock: jest.Mocked<AppListenerEffectAPI>;

  const mediaFilesMap = {
    ['/some/media/file']: {
      Title: 'File',
      FormatLongName: 'Matroska',
      FormatName: 'mkv',
      Chapters: [],
      Path: '/some/media/file',
      AudioStreams: [],
      SubtitleStreams: [],
      VideoStreams: [],
      Duration: 4,
    }
  }

  let mediaFilesRepositoryMock: jest.Mocked<MediaFilesRepository>;

  beforeAll(() => {
    mediaFilesRepositoryMock = {
      fetchMediaFiles: jest.fn(),
      iterateAddedMediaFiles: jest.fn(),
      iterateRemovedMediaFiles: jest.fn(),
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
    mediaFilesRepositoryMock.fetchMediaFiles.mockResolvedValue(mediaFilesMap);
    listenerApiMock.fork.mockReturnValue({
      cancel: jest.fn(),
    } as unknown as jest.Mocked<ForkedTask<unknown>>);
  });

  describe('subscribeToMediaFiles effect', () => {
    it('should fork subscriptions', async () => {
      const iteratorMock: AsyncGenerator<Awaited<MediaFilesMap>, void, unknown> = {
        next: jest.fn(),
        return: jest.fn(),
        throw: jest.fn(),
        [Symbol.asyncIterator]: jest.fn(),
        [Symbol.asyncDispose]: jest.fn(),
      };
      mediaFilesRepositoryMock.iterateAddedMediaFiles.mockReturnValue(makeOk(iteratorMock));
      mediaFilesRepositoryMock.iterateRemovedMediaFiles.mockReturnValue(makeOk(iteratorMock));
      const action = subscribeToMediaFiles();

      await subscribeToMediaFilesEffect(action, listenerApiMock);
    
      expect(listenerApiMock.fork).toHaveBeenCalledTimes(2);
    });

    it('should fetch media files once', async () => {
      const action = subscribeToMediaFiles();

      await subscribeToMediaFilesEffect(action, listenerApiMock);
    
      expect(listenerApiMock.dispatch).toHaveBeenCalledWith(fetchMediaFiles());
    });
  });

  describe('fetchMediaFiles effect', () => {
    it('should call fetch media files on repository', async () => {
      const action = fetchMediaFiles();

      await fetchMediaFilesEffect(action, listenerApiMock);
    
      expect(mediaFilesRepositoryMock.fetchMediaFiles).toHaveBeenCalled();
    });

    it('should dispatch mediaFilesAdded action', async () => {
      const action = fetchMediaFiles();

      await fetchMediaFilesEffect(action, listenerApiMock);
    
      expect(listenerApiMock.dispatch).toHaveBeenCalledWith(mediaFilesFetched(mediaFilesMap));
    });
  });
});
