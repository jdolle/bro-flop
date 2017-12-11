import { Entity } from './Entity'

export type Signature = number

/**
 * Maintains the signatures for entities. This is which components the entity contains
 * for fastchecking if it matches for systems.
 */
export class EntitySignatures {
  public onSignatureChange?: (
    entity: Entity,
    nextSignature: Signature,
    signature: Signature,
  ) => void

  private signatures: Signature[] = []

  public static Matches(signature: Signature, mask: Signature) {
    return mask === (signature & mask)
  }

  public add(entity: Entity, signature: Signature) {
    const currentSignature = this.signatures[entity] === undefined ? 0 : this.signatures[entity]
    const nextSignature = currentSignature | signature
    this.signatures[entity] = nextSignature

    if (this.onSignatureChange !== undefined) {
      this.onSignatureChange(entity, nextSignature, currentSignature)
    }
  }

  public remove(entity: Entity, signature: Signature) {
    const currentSignature = this.signatures[entity]
    const nextSignature = currentSignature & ~signature
    this.signatures[entity] = nextSignature

    if (this.onSignatureChange !== undefined) {
      this.onSignatureChange(entity, nextSignature, currentSignature)
    }
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
