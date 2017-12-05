import { Entity } from '../Entity'
import { Signature } from '../EntitySignatures'
import { CES } from '../index'

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
