type EventResult<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends (eventPayload: string) => any,
  T extends Record<string, F>,
  K extends keyof T
> = ReturnType<T[K]>;

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

  aggregate<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    F extends (eventPayload: string | undefined) => any,
    T extends Record<string, F>,
    K extends keyof T
  >(eventToMapper: T): AsyncGenerator<EventResult<F, T, K>, void, unknown> {
    const eventToIterator = new Map<string, AsyncIterator<string>>;
  
    for (const eventName of Object.keys(eventToMapper)) {
      eventToIterator.set(eventName, this.observeRaw(eventName));
    }

    // start iterating over events as soon as aggregate is called
    // this way next() already awaits on events and does not require immedate consumption of retured generator

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iteratorPromises: Map<string, Promise<{ eventName: string, result: IteratorResult<any> }>> = new Map();
    for (const [eventName, iterator] of eventToIterator.entries()) {
      iteratorPromises.set(eventName, iterator.next().then(result => {
        return {
          eventName,
          result
        };
      }));
    }

    return async function*() {
      while (eventToIterator.size) {
        const { eventName, result } = await Promise.any(iteratorPromises.values());
        const mapper = eventToMapper[eventName];
        if (!mapper) {
          console.error(`could not find mapper for received event name "${eventName}"`);
          continue;
        }

        yield mapper(result.value);
      
        iteratorPromises.delete(eventName);
        if (result.done) {
          eventToIterator.delete(eventName);
        } else {
          const iterator = eventToIterator.get(eventName);
          if (!iterator) {
            throw new Error('iterator could not be found');
          }

          iteratorPromises.set(eventName, iterator.next().then(result => {
            return {
              eventName,
              result
            };
          }));
        }
      }
    }();
  }

  close() {
    this.eventSource?.close();
  }

  private async *iterateOverEvents(eventName: string) {
    while(true) {
      await this.waitTillEventsAvailable(eventName);

      while (this.eventsMap.get(eventName)?.length) {
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

async function tick(timeoutMs = 1000) {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutMs);
  });
}
