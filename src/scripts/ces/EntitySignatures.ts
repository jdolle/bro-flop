import { Entity } from './Entity'

export type Signature = number

/**
 * Maintains the signatures for entities. This is which components the entity contains
 * for fastchecking if it matches for systems.
 */
export class EntitySignatures {
  private signatures: Signature[] = []

  public add(entity: Entity, signature: Signature) {
    const currentSignature = this.signatures[entity] === undefined ? 0 : this.signatures[entity]
    this.signatures[entity] = currentSignature | signature
  }

  public remove(entity: Entity, signature: Signature) {
    this.signatures[entity] &= ~signature
  }

  public match(entity: Entity, signature: Signature): boolean {
    return (this.signatures[entity] & signature) === signature
  }

  public forEach(callback: (entity: Entity) => void, signatureFilter: Signature = 0x0) {
    const numSigs = this.signatures.length

    for (let i: Entity = 0; i < numSigs; i += 1) {
      const signature = this.signatures[i]

      if (signature !== undefined && (signature & signatureFilter) === signatureFilter) {
        callback(i)
      }
    }
  }

  public clear(entity?: Entity) {
    if (entity === undefined) {
      this.signatures = []
    } else {
      this.signatures[entity] = 0x0
    }
  }
}
