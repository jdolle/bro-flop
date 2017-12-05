import { Entity } from '../ces/Entity'
import { Signature } from '../ces/EntitySignatures'
import { CES } from '../ces'

/**
 * BaseSystem
 */
export abstract class BaseSystem {
  public readonly signature: Signature
  protected entitySystem: CES

  public abstract process(...args: any[]): void

  /**
   * Update the system
   */
  protected abstract processEntity(entity: Entity, ...args: any[]): void
}
