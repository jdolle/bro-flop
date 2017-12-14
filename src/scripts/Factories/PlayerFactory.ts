import { World } from 'matter-js'

import { createRagdoll } from './RagdollFactory'
import { Entity } from '../ces/Entity'
import { PlayerControllerComponent } from '../ces/Components/PlayerControllerComponent'
import { PositionComponent } from '../ces/Components/PositionComponent'
import { PhysicsComponent } from '../ces/Components/PhysicsComponent'
import { GrappleComponent } from '../ces/Components/GrappleComponent'
import { SoundsComponent } from '../ces/Components/SoundsComponent'
import { CES } from '../ces'
import { NativeAudio } from '../NativeAudio'

const addPositionComponent = (entitySystem: CES, entity: Entity) => {
  const p = PositionComponent.Create(1.0, 2.0)
  entitySystem.positions.add(entity, p)
}

const addPhysicsComponent = (
  entitySystem: CES,
  entity: Entity,
  world: World,
  x: number,
  y: number,
) => {
  const playerRagdoll = createRagdoll(x, y, 0.5, {
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

const addSoundsComponent = (entitySystem: CES, entity: Entity) => {
  NativeAudio().preloadSimple('grunt', 'res/audio/grunt-01.wav')
  NativeAudio().preloadSimple('pop', 'res/audio/bubble-pop-01.wav')
  const c = SoundsComponent.Create({
    collision: 'grunt',
    grapple_release: 'pop',
  })
  entitySystem.sounds.add(entity, c)
}

export const createPlayer = (entitySystem: CES, world: World, x: number, y: number) => {
  const entity = entitySystem.createEntity()

  addPositionComponent(entitySystem, entity)
  addPhysicsComponent(entitySystem, entity, world, x, y)
  addPlayerControllerComponent(entitySystem, entity)
  addGrappleComponent(entitySystem, entity)
  addSoundsComponent(entitySystem, entity)

  return entity
}
