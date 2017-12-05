import { Entity } from '../Entity'
import { Signature } from '../EntitySignatures'
import { World as EntitySystem } from '../World'

/**
 * BaseSystem
 */
export abstract class BaseSystem {
  public readonly signature: Signature
  protected entitySystem: EntitySystem

  public abstract process(): void //{
  //   this.entitySystem.entitySignatures.forEach(this.processEntity, this.signature)
  // }

  /**
   * Update the system
   */
  protected abstract processEntity(entity: Entity, ...args: any[]): void
}
