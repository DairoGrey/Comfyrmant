export class RandomTickEvent extends CustomEvent<never> {
  constructor() {
    super(EventName.RandomTick);
  }
}

export enum EventName {
  RandomTick = 'custom.randomtick',
}

type Unsubscribe = () => void;

class EventBus {
  subscribe(eventName: EventName.RandomTick, handler: (e: RandomTickEvent) => void): Unsubscribe;

  subscribe(eventName: any, handler: any): Unsubscribe {
    document.addEventListener(eventName, handler);

    return () => {
      document.removeEventListener(eventName, handler);
    };
  }

  dispatch(event: RandomTickEvent): void;

  dispatch(event: CustomEvent<any>) {
    document.dispatchEvent(event);
  }
}

export const eventBus = new EventBus();
