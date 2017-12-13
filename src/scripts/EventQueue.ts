import { Signal } from 'micro-signals'

type Message = string

/**
 * Handles events. Not sold on `micro-signals`. Consider https://github.com/choojs/nanobus
 */
export class EventQueue {
  private signals: Signal<Message>[]

  constructor() {
    this.signals = []
  }

  public dispatch(id: number, message: Message) {
    if (this.signals[id] !== undefined) {
      this.signals[id].dispatch(message)
    }
  }

  public subscribe(id: number, cb: (message: Message) => void) {
    if (this.signals[id] === undefined) {
      this.signals[id] = new Signal<Message>()
    }

    this.signals[id].add(cb)
  }

  public unsubscribe(_id: number, _cb: (message: Message) => void) {
    // this.signals[id].filter() // TODO
  }
}
