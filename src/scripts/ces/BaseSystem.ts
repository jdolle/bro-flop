import { Entity } from '../ces/Entity'
import { Signature } from '../ces/EntitySignatures'
import { CES } from '../ces'

/**
 * BaseSystem
 */
export abstract class BaseSystem {
  public readonly signature: Signature
  protected entitySystem: CES

  public abstract process(): void

  public abstract onEntityAdded(entity: Entity): void
  public abstract onEntityRemoved(entity: Entity): void

  /**
   * Update the system
   */
  protected abstract processEntity(entity: Entity): void
}
