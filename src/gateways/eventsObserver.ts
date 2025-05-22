type EventResult<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends (eventPayload: string) => any,
  T extends Record<string, F>,
  K extends keyof T
> = ReturnType<T[K]>;

type SourceEvent = {
  eventName: string,
  data: string
};

export class EventsObserver {
  private registeredEvents: Set<string> = new Set();
  private eventsQueue: SourceEvent[] = [];
  private eventSource: EventSource | undefined;

  setSource(eventSource: EventSource) {
    this.eventSource = eventSource;

    for (const eventName of this.registeredEvents) {
      this.addEventListener(eventName);
    }
  }

  observe<T>(event: string) {
    const iterator = this.observeRaw(event);
    return async function*() {
      for await (const ev of iterator) {
        yield JSON.parse(ev.data) as T
      }
    }();
  }

  private observeRaw(event: string) {
    this.addEventListener(event);

    return this.iterateOverEventsOfName(event);
  }

  aggregate<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    F extends (eventPayload: string | undefined) => any,
    T extends Record<string, F>,
    K extends keyof T
  >(eventToMapper: T): AsyncGenerator<EventResult<F, T, K>, void, unknown> {
    const allEventNames = Object.keys(eventToMapper);
    for (const eventName of allEventNames) {
      this.addEventListener(eventName);
    }

    const eventsIterator = this.iterateOverEvents(allEventNames);
    return async function*() {
      for await (const { eventName, data } of eventsIterator) {
        const mapper = eventToMapper[eventName];
        if (!mapper) {
          console.error(`could not find mapper for received event name "${eventName}"`);
          continue;
        }

        yield mapper(data);
      }
    }();
  }

  close() {
    this.eventSource?.close();
  }

  private async *iterateOverEventsOfName(eventName: string) {
    while(true) {
      yield this.waitTillEventsAvailable(eventName);
    }
  }

  private async *iterateOverEvents(events: string[]) {
    while(true) {
      const availableEvents = await this.waitTillAnyEventAvailable(events);
      for (const event of availableEvents) {
        yield event;
      }
    }
  }

  private addEventListener(eventName: string) {
    if (this.registeredEvents.has(eventName)) {
      throw new Error(`event "${eventName}" already has been subscribed to - iterating over events by more than one observer is not supported`);
    }

    this.registeredEvents.add(eventName);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.eventSource?.addEventListener(eventName, (event: any) => {
      this.eventsQueue.push({
        eventName,
        data: event.data ?? ''
      });
    });
  }

  private async waitTillAnyEventAvailable(eventNames: string[]): Promise<SourceEvent[]> {
    let events: SourceEvent[] = [];
    do {
      await tick();
      events = this.collectAvailableEvents(eventNames)!;
    } while (!events.length);

    return events;
  }

  private async waitTillEventsAvailable(eventName: string): Promise<SourceEvent> {
    while (this.eventsQueue[0]?.eventName !== eventName) {
      await tick();
    }

    return this.eventsQueue.shift()!;
  }

  private collectAvailableEvents(eventNames: string[]): SourceEvent[] {
    const availableEvents: SourceEvent[] = [];
    const newEventsQueue = [];
    for (const event of this.eventsQueue) {
      const matches = eventNames.some(eventName => eventName === event.eventName);
      if (matches) {
        availableEvents.push(event);
      } else {
        newEventsQueue.push(event);
      }
    }

    this.eventsQueue = newEventsQueue;
    return availableEvents;
  }
}

async function tick(timeoutMs = 500) {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutMs);
  });
}
