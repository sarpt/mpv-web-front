async function tick() {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    });
  });
}

export class EventsObserver<T> {
  private events: T[] = [];

  constructor(private event: string) {}

  setSource(eventSource: EventSource) {
    eventSource.addEventListener(this.event, (event: any) => {
      this.events.push(JSON.parse(event.data ?? '') as T);  
    });
  }

  async *observe() {
    let nextIdx = 0;

    while(true) {
      await this.waitTillNextEvent();

      for (let idx = nextIdx; idx < this.events.length; idx++) {
        yield this.events[idx];
        nextIdx = idx + 1;
      }
    }
  }

  private async waitTillNextEvent() {
    const previousEventsCount = this.events.length;

    while (true) {
      if (this.events.length > previousEventsCount) return;

      await tick();
    }
  }
}
