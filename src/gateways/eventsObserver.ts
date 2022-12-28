async function tick() {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    });
  });
}

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
    this.addEventListener(event);

    return this.iterateOverEvents<T>(event);
  }

  private async *iterateOverEvents<T>(eventName: string) {
    while(true) {
      await this.waitTillEventsAvailable(eventName);

      while (this.eventsMap.get(eventName)?.length) {
        await tick();
        const nextEvent = this.eventsMap.get(eventName)?.shift() ?? '';
        yield JSON.parse(nextEvent) as T;
      }
    }
  }

  private addEventListener(eventName: string) {
    this.eventsMap.set(eventName, []);

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
