import { container, Dependencies } from "../../../di";
import { AppListenerEffectAPI } from "../../../reducers";
import { fetchMediaFiles, subscribeToMediaFiles, mediaFilesFetched } from "../actions";
import { fetchMediaFilesEffect, subscribeToMediaFilesEffect } from "../listeners";

describe('media files listeners', () => {
  const listenerApiMock = {
    fork: jest.fn(),
    dispatch: jest.fn(),
  } as unknown as AppListenerEffectAPI;

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

  const mediaFilesRepositoryMock = {
    fetchMediaFiles: jest.fn(),
  };

  beforeAll(() => {
    container.bind(Dependencies.MediaFilesRepository).toValue(mediaFilesRepositoryMock);
  });

  beforeEach(() => {
    mediaFilesRepositoryMock.fetchMediaFiles.mockResolvedValue({
      mediaFiles: mediaFilesMap
    })
  });

  describe('subscribeToMediaFiles effect', () => {
    it('should fork subscriptions', async () => {
      const action = subscribeToMediaFiles();

      await subscribeToMediaFilesEffect(action, listenerApiMock);
    
      expect(listenerApiMock.fork).toHaveBeenCalledTimes(2);
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

    it('should dispatch subscribeToMediaFiles action', async () => {
      const action = fetchMediaFiles();

      await fetchMediaFilesEffect(action, listenerApiMock);
    
      expect(listenerApiMock.dispatch).toHaveBeenCalledWith(subscribeToMediaFiles());
    });
  });
});
