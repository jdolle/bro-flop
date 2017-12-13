import { BaseSystem } from '../ces/BaseSystem'
import { Entity } from '../ces/Entity'
import { SoundsComponent } from '../ces/Components/SoundsComponent'
import { CES } from '../ces/'
import { NativeAudio } from '../NativeAudio'
import { EventQueue } from '../EventQueue'

/**
 * Physics system -- updates positions based on sounds bodies and applies
 * forces
 */
export class SoundsSystem extends BaseSystem {
  public readonly signature = SoundsComponent.typeEnum
  protected entitySystem: CES
  private eventQueue: EventQueue

  constructor(entitySystem: CES, eventQueue: EventQueue) {
    super()
    this.entitySystem = entitySystem
    this.eventQueue = eventQueue
    this.processEntity = this.processEntity.bind(this)
  }

  public onEntityRemoved(entity: Entity) {
    this.eventQueue.unsubscribe(entity, this.processEvent(entity))
  }

  public onEntityAdded(entity: Entity) {
    this.eventQueue.subscribe(entity, this.processEvent(entity))
  }

  public process(): void {
    // do nothing
    // this.entitySystem.entitySignatures.forEach(this.processEntity, this.signature)
  }

  protected processEntity(_entity: Entity): void {
    // do nothing
  }

  private processEvent(entity: Entity) {
    return (message: string) => {
      const sounds = this.entitySystem.sounds.find(entity)

      if (sounds === undefined) {
        return
      }

      const sound = sounds.state.eventSounds[message]

      if (sound !== undefined) {
        NativeAudio().play(sound)
      }
    }
  }
}
