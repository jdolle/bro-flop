import { PositionComponent } from './Components/PositionComponent'
import { PhysicsComponent } from './Components/PhysicsComponent'
import { PlayerControllerComponent } from './Components/PlayerControllerComponent'
import { GrappleComponent } from './Components/GrappleComponent'
import { SoundsComponent } from './Components/SoundsComponent'
import { ComponentList } from './ComponentList'
import { Entity } from './Entity'
import { EntitySignatures, Signature } from './EntitySignatures'
import { BaseSystem } from './BaseSystem'

/**
 * Component entity system - A world filled with entities
 */
export class CES {
  public entitySignatures: EntitySignatures
  public positions: ComponentList<PositionComponent>
  public physics: ComponentList<PhysicsComponent>
  public grapples: ComponentList<GrappleComponent>
  public playerController: ComponentList<PlayerControllerComponent>
  public sounds: ComponentList<SoundsComponent>

  private nextEntity = 0
  private recycledEntities: Entity[] // TODO implement linked list or pool?

  private systems: BaseSystem[]

  constructor() {
    this.systems = []
    this.recycledEntities = []
    this.entitySignatures = new EntitySignatures()
    this.entitySignatures.onSignatureChange = (
      entity: Entity,
      nextSignature: Signature,
      signature: Signature,
    ) => {
      for (const system of this.systems) {
        const nextMatches = EntitySignatures.Matches(nextSignature, system.signature)
        const oldMatches = EntitySignatures.Matches(signature, system.signature)

        if (nextMatches && !oldMatches) {
          system.onEntityAdded(entity)
        } else if (oldMatches && !nextMatches) {
          system.onEntityRemoved(entity)
        }
      }
    }

    this.positions = new ComponentList<PositionComponent>(this.entitySignatures)
    this.physics = new ComponentList<PhysicsComponent>(this.entitySignatures)
    this.playerController = new ComponentList<PlayerControllerComponent>(this.entitySignatures)
    this.grapples = new ComponentList<GrappleComponent>(this.entitySignatures)
    this.sounds = new ComponentList<SoundsComponent>(this.entitySignatures)
  }

  public createEntity(): Entity {
    const recycled = this.recycledEntities.pop()
    const entity = recycled === undefined ? this.nextEntity += 1 : recycled

    this.entitySignatures.add(entity, 0)

    return entity
  }

  public releaseEntity(entity: Entity): void {
    this.recycledEntities.push(entity)
    this.entitySignatures.clear(entity)
    this.positions.clear(entity)
    this.physics.clear(entity)
    this.playerController.clear(entity)
    this.grapples.clear(entity)
    this.sounds.clear(entity)
  }

  public clearEntities(): void {
    this.nextEntity = 0
    this.recycledEntities = []
    this.entitySignatures.clear()
    this.positions.clear()
    this.physics.clear()
    this.playerController.clear()
    this.grapples.clear()
    this.sounds.clear()
  }

  public addSystem<T extends BaseSystem>(sys: T) {
    this.systems.push(sys)

    this.entitySignatures.forEach(
      (entity) => {
        sys.onEntityAdded(entity)
      },
      sys.signature,
    )
  }

  public process() {
    for (const system of this.systems) {
      system.process()
    }
  }

  public clearSystems() {
    this.systems = []
  }
}
