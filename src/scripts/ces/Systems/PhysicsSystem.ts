import {
  Vector,
  World,
  Body,
} from 'matter-js'
import { BaseSystem } from './BaseSystem'
import { Entity } from '../Entity'
import { PhysicsComponent } from '../Components/PhysicsComponent'
import { World as EntitySystem } from '../World'

const tempVector = Vector.create() // reusable vector to avoid allocation

const isChest = (body: Body) => {
  return body.label === 'chest'
}

/**
 * An example system that updates the position
 */
export class PhysicsSystem extends BaseSystem {
  public readonly signature = PhysicsComponent.typeEnum
  protected entitySystem: EntitySystem
  private world: World

  constructor(entitySystem: EntitySystem, world: World) {
    super()
    this.entitySystem = entitySystem
    this.world = world

    this.processEntity = this.processEntity.bind(this)
  }

  public process(): void {
    this.entitySystem.entitySignatures.forEach(this.processEntity, this.signature)
  }

  protected processEntity(entity: Entity): void {
    const physics = this.entitySystem.physics.find(entity)

    if (physics === undefined || physics.state.composite === undefined) {
      return
    }

    // apply constant force to chest
    const chest = physics.state.composite.bodies.find(isChest)

    if (chest !== undefined) {
      const { gravity } = this.world

      tempVector.x = gravity.x * gravity.scale * -1.5
      tempVector.y = gravity.y * gravity.scale * -1.5
      Body.applyForce(
        chest,
        chest.position,
        tempVector,
      )
    }
  }
}
