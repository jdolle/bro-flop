import { BaseComponent } from './BaseComponent'
import { ComponentType } from './ComponentType'

type EventSounds = {
  [key: string]: string,
}

/**
 * Maps entity specific events to sounds
 */
export class SoundsComponent implements BaseComponent {
  public static readonly typeEnum: ComponentType = ComponentType.SOUNDS
  public readonly state: {
    eventSounds: EventSounds,
  }

  constructor(eventSounds: EventSounds = {}) {
    this.state = {
      eventSounds,
    }
  }

  // Should use a pool
  public static Create(eventSounds: EventSounds = {}): SoundsComponent {
    return new SoundsComponent(eventSounds)
  }

  public static Release(_component: SoundsComponent) {
    return true
  }
}
