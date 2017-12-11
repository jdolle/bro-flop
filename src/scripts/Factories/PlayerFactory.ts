import { World } from 'matter-js'

import { Entity } from '../ces/Entity'
import { PlayerControllerComponent } from '../ces/Components/PlayerControllerComponent'
import { PositionComponent } from '../ces/Components/PositionComponent'
import { PhysicsComponent } from '../ces/Components/PhysicsComponent'
import { GrappleComponent } from '../ces/Components/GrappleComponent'
import { CES } from '../ces'
import { createRagdoll } from './RagdollFactory'

const addPositionComponent = (entitySystem: CES, entity: Entity) => {
  const p = PositionComponent.Create(1.0, 2.0)
  entitySystem.positions.add(entity, p)
}

const addPhysicsComponent = (entitySystem: CES, entity: Entity, world: World) => {
  const playerRagdoll = createRagdoll(100, 200, 0.5, {
    friction: 0.5,
    frictionAir: 0.02,
  })
  World.add(world, [playerRagdoll])

  const p = PhysicsComponent.Create(playerRagdoll)
  entitySystem.physics.add(entity, p)
}

const addGrappleComponent = (entitySystem: CES, entity: Entity) => {
  const p = GrappleComponent.Create()
  entitySystem.grapples.add(entity, p)
}

const addPlayerControllerComponent = (entitySystem: CES, entity: Entity) => {
  const p = PlayerControllerComponent.Create()
  entitySystem.playerController.add(entity, p)
}

export const createPlayer = (entitySystem: CES, world: World) => {
  const entity = entitySystem.createEntity()

  addPositionComponent(entitySystem, entity)
  addPhysicsComponent(entitySystem, entity, world)
  addPlayerControllerComponent(entitySystem, entity)
  addGrappleComponent(entitySystem, entity)

  return entity
}
