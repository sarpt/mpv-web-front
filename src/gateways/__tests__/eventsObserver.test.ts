import { EventsObserver } from "../eventsObserver";


type MockEvent = {
  msg: string,
}

describe('eventsObserver', () => {
  let uut: EventsObserver; 

  beforeEach(() => {
    uut = new EventsObserver();
  });

  describe('observe', () => {
    let listenerCb: (event: { data: string }) => void;

    const eventSourceMock = {
      addEventListener: jest.fn(),
    } as unknown as jest.Mocked<EventSource>;

    beforeEach(() => {
      listenerCb = () => { throw new Error('this listener should not have been called') };
      eventSourceMock.addEventListener.mockImplementation((_name, cb: unknown) => { listenerCb = cb as typeof listenerCb; });
      uut.setSource(eventSourceMock);
    });

    it('should iterate over emitted events', async () => {
      const eventName = 'mockEvent';

      const results = uut.observe<MockEvent>(eventName);
    
      listenerCb({ data: '{ "msg": "first event" }' });
      listenerCb({ data: '{ "msg": "second event" }' });
    
      const firstEvent = await results.next();
      expect(firstEvent.value).toStrictEqual({ msg: 'first event' }) ;

      const secondEvenet = await results.next();
      expect(secondEvenet.value).toStrictEqual({ msg: 'second event' }) ;
    });
  });
});