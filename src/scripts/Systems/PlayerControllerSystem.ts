import {
  Body,
  Vector,
} from 'matter-js'

import { CES } from '../ces/'
import { Entity } from '../ces/Entity'
import { ComponentType } from '../ces/Components/ComponentType'
import { BaseSystem } from '../ces/BaseSystem'
import { PlayerActions } from '../controller'
import {
  isLeftLeg,
  isRightLeg,
  isRightHand,
  isLeftHand,
  isChest,
} from '../bodyFilters'

/**
 * Player controller system
 */
export class PlayerControllerSystem extends BaseSystem {
  private static tmpVector = Vector.create(0, 0)
  private static readonly FORCE_LEFT = Vector.create(-0.003, 0)
  private static readonly FORCE_RIGHT = Vector.create(0.003, 0)
  private static readonly FORCE_UP = Vector.create(0, -0.003)
  private static readonly FORCE_DOWN = Vector.create(0, 0.003)

  public readonly signature = ComponentType.PHYSICS | ComponentType.PLAYER_CONTROLLER
  protected entitySystem: CES

  constructor(entitySystem: CES) {
    super()
    this.entitySystem = entitySystem
    this.processEntity = this.processEntity.bind(this)
  }

  private static moveBody(force: Vector, ragdollBodies: Body[], filter: (b: Body) => boolean) {
    const body = ragdollBodies.find(filter)

    if (body !== undefined) {
      Body.applyForce(body, body.position, force)
    }
  }

  public onEntityRemoved(_entity: Entity) {
    // do nothing
  }

  public onEntityAdded(_entity: Entity) {
    // do nothing
  }

  public process(): void {
    this.entitySystem.entitySignatures.forEach(this.processEntity, this.signature)
  }

  protected processEntity(entity: Entity): void {
    const physics = this.entitySystem.physics.find(entity)
    const controller = this.entitySystem.playerController.find(entity)

    if (controller === undefined || physics === undefined) {
      return
    }

    const { state } = controller.state.playerController
    const { composite } = physics.state

    if (composite === undefined) {
      return
    }

    const ragdollBodies = composite.bodies

    PlayerControllerSystem.tmpVector.x = 0
    PlayerControllerSystem.tmpVector.y = 0

    if (state[PlayerActions.moveLeft]) {
      PlayerControllerSystem.tmpVector.x += PlayerControllerSystem.FORCE_LEFT.x
      PlayerControllerSystem.tmpVector.y += PlayerControllerSystem.FORCE_LEFT.y
    }
    if (state[PlayerActions.moveRight]) {
      PlayerControllerSystem.tmpVector.x += PlayerControllerSystem.FORCE_RIGHT.x
      PlayerControllerSystem.tmpVector.y += PlayerControllerSystem.FORCE_RIGHT.y
    }
    if (state[PlayerActions.moveUp]) {
      PlayerControllerSystem.tmpVector.x += PlayerControllerSystem.FORCE_UP.x
      PlayerControllerSystem.tmpVector.y += PlayerControllerSystem.FORCE_UP.y
    }
    if (state[PlayerActions.moveDown]) {
      PlayerControllerSystem.tmpVector.x += PlayerControllerSystem.FORCE_DOWN.x
      PlayerControllerSystem.tmpVector.y += PlayerControllerSystem.FORCE_DOWN.y
    }

    // Move limbs based on player actions
    let bodyMultiplier = 4
    if (state[PlayerActions.activateLeftFoot]) {
      PlayerControllerSystem.moveBody(PlayerControllerSystem.tmpVector, ragdollBodies, isLeftLeg)
      bodyMultiplier -= 1
    }

    if (state[PlayerActions.activateRightFoot]) {
      PlayerControllerSystem.moveBody(PlayerControllerSystem.tmpVector, ragdollBodies, isRightLeg)
      bodyMultiplier -= 1
    }

    if (state[PlayerActions.activateLeftHand]) {
      PlayerControllerSystem.moveBody(PlayerControllerSystem.tmpVector, ragdollBodies, isLeftHand)
      bodyMultiplier -= 1
    }

    if (state[PlayerActions.activateRightHand]) {
      PlayerControllerSystem.moveBody(PlayerControllerSystem.tmpVector, ragdollBodies, isRightHand)
      bodyMultiplier -= 1
    }

    if (bodyMultiplier !== 0) {
      PlayerControllerSystem.tmpVector.x *= bodyMultiplier
      PlayerControllerSystem.tmpVector.y *= bodyMultiplier
      PlayerControllerSystem.moveBody(PlayerControllerSystem.tmpVector, ragdollBodies, isChest)
    }
  }
}
