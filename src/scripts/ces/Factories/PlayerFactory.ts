import { World } from 'matter-js'

import { Entity } from '../Entity'
import { PlayerControllerComponent } from '../Components/PlayerControllerComponent'
import { PositionComponent } from '../Components/PositionComponent'
import { PhysicsComponent } from '../Components/PhysicsComponent'
import { World as EntitySystem } from '../World'
import { ragdoll } from '../../ragdoll'

const addPositionComponent = (entitySystem: EntitySystem, entity: Entity) => {
  const p = PositionComponent.Create(1.0, 2.0)
  entitySystem.positions.add(entity, p)
}

const addPhysicsComponent = (entitySystem: EntitySystem, entity: Entity, world: World) => {
  const playerRagdoll = ragdoll(100, 200, 0.5, {
    friction: 0.5,
    frictionAir: 0.02,
  })
  World.add(world, [playerRagdoll])

  const p = PhysicsComponent.Create(playerRagdoll)
  entitySystem.physics.add(entity, p)
}

const addPlayerControllerComponent = (entitySystem: EntitySystem, entity: Entity) => {
  const p = PlayerControllerComponent.Create()
  entitySystem.playerController.add(entity, p)
}

export const createPlayer = (entitySystem: EntitySystem, world: World) => {
  const entity = entitySystem.createEntity()

  addPositionComponent(entitySystem, entity)
  addPhysicsComponent(entitySystem, entity, world)
  addPlayerControllerComponent(entitySystem, entity)

  return entity
}
