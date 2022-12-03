import { MediaFilesSubscriptions } from "../../../../../domains/media_files/entities";
import { FetchMediaFilesUC } from "../../../../../domains/media_files/usecases/fetchMediaFiles";
import { SubscribeToMediaFilesUC } from "../../../../../domains/media_files/usecases/subscribeToMediaFiles";
import { container, Dependencies } from "../../../di";
import { AppListenerEffectAPI } from "../../../store";
import { fetchMediaFiles, subscribeToMediaFiles, mediaFilesAdded } from "../actions";
import { fetchMediaFilesEffect, subscribeToMediaFilesEffect } from "../listeners";

describe('media files listeners', () => {
  const subscribeToMediaFilesUCMock: jest.Mocked<SubscribeToMediaFilesUC> = {
    invoke: jest.fn(),
  };
  const fetchMediaFilesUCMock: jest.Mocked<FetchMediaFilesUC> = {
    invoke: jest.fn(),
  };

  const subscriptionsMock = {
    added: jest.fn(),
    remove: jest.fn()
  } as unknown as MediaFilesSubscriptions;

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

  beforeAll(() => {
    container.bind(Dependencies.SubscribeToMediaFilesUC).toValue(subscribeToMediaFilesUCMock);
    container.bind(Dependencies.FetchMediaFilesUC).toValue(fetchMediaFilesUCMock);
  });

  beforeEach(() => {
    subscribeToMediaFilesUCMock.invoke.mockResolvedValue({ subscriptions: subscriptionsMock });
    fetchMediaFilesUCMock.invoke.mockResolvedValue({
      mediaFiles: mediaFilesMap
    })
  });

  describe('subscribeToMediaFiles effect', () => {
    it('should call subscribe to media files UC', async () => {
      const action = subscribeToMediaFiles();

      await subscribeToMediaFilesEffect(action, listenerApiMock);
    
      expect(subscribeToMediaFilesUCMock.invoke).toHaveBeenCalled();
    });

    it('should fork subscriptions', async () => {
      const action = subscribeToMediaFiles();

      await subscribeToMediaFilesEffect(action, listenerApiMock);
    
      expect(listenerApiMock.fork).toHaveBeenCalledTimes(2);
    });
  });

  describe('fetchMediaFiles effect', () => {
    it('should call fetch media files UC', async () => {
      const action = fetchMediaFiles();

      await fetchMediaFilesEffect(action, listenerApiMock);
    
      expect(fetchMediaFilesUCMock.invoke).toHaveBeenCalled();
    });

    it('should dispatch mediaFilesAdded action', async () => {
      const action = fetchMediaFiles();

      await fetchMediaFilesEffect(action, listenerApiMock);
    
      expect(listenerApiMock.dispatch).toHaveBeenCalledWith(mediaFilesAdded(mediaFilesMap));
    });

    it('should dispatch subscribeToMediaFiles action', async () => {
      const action = fetchMediaFiles();

      await fetchMediaFilesEffect(action, listenerApiMock);
    
      expect(listenerApiMock.dispatch).toHaveBeenCalledWith(subscribeToMediaFiles());
    });
  });
});
