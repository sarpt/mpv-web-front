async function tick() {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    });
  });
}

type EventResult<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends (eventPayload: string) => any,
  T extends Record<string, F>,
  K extends keyof T
> = {
  name: string,
  payload: ReturnType<T[K]>
};

export class EventsObserver {
  private eventsMap: Map<string, string[]> = new Map();
  private eventSource: EventSource | undefined;

  setSource(eventSource: EventSource) {
    this.eventSource = eventSource;

    for (const [eventName] of this.eventsMap.entries()) {
      this.addEventListener(eventName);
    }
  }

  observe<T>(event: string) {
    const iterator = this.observeRaw(event);
    return async function*() {
      for await (const ev of iterator) {
        yield JSON.parse(ev) as T
      }
    }();
  }

  private observeRaw(event: string) {
    this.addEventListener(event);

    return this.iterateOverEvents(event);
  }

  async *aggregate<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    F extends (eventPayload: string) => any,
    T extends Record<string, F>,
    K extends keyof T
  >(eventToMapper: T): AsyncGenerator<EventResult<F, T, K>, void, unknown> {
    const eventToIterator = new Map<string, AsyncIterator<string>>;
  
    for (const eventName of Object.keys(eventToMapper)) {
      eventToIterator.set(eventName, this.observeRaw(eventName));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iteratorPromises: Map<string, Promise<{ eventName: string, result: IteratorResult<any> }>> = new Map();
    while (eventToIterator.size) {
      for (const [eventName, iterator] of eventToIterator.entries()) {
        if (iteratorPromises.has(eventName)) continue;

        iteratorPromises.set(eventName, iterator.next().then(result => {
          return {
            eventName,
            result
          };
        }));
      }

      const { eventName, result } = await Promise.any(iteratorPromises.values());
      const mapper = eventToMapper[eventName];
      if (!mapper) {
        console.error(`could not find mapper for received event name "${eventName}"`);
        continue;
      }

      yield {
        name: eventName,
        payload: mapper(result.value)
      }
    
      iteratorPromises.delete(eventName);
      if (result.done) {
        eventToIterator.delete(eventName);
      }
    }
  }

  close() {
    this.eventSource?.close();
  }

  private async *iterateOverEvents(eventName: string) {
    while(true) {
      await this.waitTillEventsAvailable(eventName);

      while (this.eventsMap.get(eventName)?.length) {
        await tick();
        yield this.eventsMap.get(eventName)?.shift() ?? '';
      }
    }
  }

  private addEventListener(eventName: string) {
    this.eventsMap.set(eventName, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.eventSource?.addEventListener(eventName, (event: any) => {
      this.eventsMap.get(eventName)?.push(event.data);  
    });
  }

  private async waitTillEventsAvailable(event: string) {
    while (!this.eventsMap.get(event)?.length) {
      await tick();
    }
  }
}
