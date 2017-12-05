import { PositionComponent } from './Components/PositionComponent'
import { PhysicsComponent } from './Components/PhysicsComponent'
import { PlayerControllerComponent } from './Components/PlayerControllerComponent'
import { ComponentList } from './ComponentList'
import { Entity } from './Entity'
import { EntitySignatures } from './EntitySignatures'

/**
 * Component entity system - A world filled with entities
 */
export class CES {
  public entitySignatures: EntitySignatures
  public positions: ComponentList<PositionComponent>
  public physics: ComponentList<PhysicsComponent>
  public playerController: ComponentList<PlayerControllerComponent>

  private nextEntity = 0
  private recycledEntities: Entity[] // TODO implement linked list or pool?

  constructor() {
    this.recycledEntities = []
    this.entitySignatures = new EntitySignatures()

    this.positions = new ComponentList<PositionComponent>(this.entitySignatures)
    this.physics = new ComponentList<PhysicsComponent>(this.entitySignatures)
    this.playerController = new ComponentList<PlayerControllerComponent>(this.entitySignatures)
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
  }

  public clearEntities(): void {
    this.nextEntity = 0
    this.recycledEntities = []
    this.entitySignatures.clear()
    this.positions.clear()
  }
}
