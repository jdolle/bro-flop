import {
  Body,
  Vector,
} from 'matter-js'

import { CES } from '../ces/'
import { Entity } from '../ces/Entity'
import { ComponentType } from '../ces/Components/ComponentType'
import { BaseSystem } from '../ces/BaseSystem'
import {
  PlayerController,
  PlayerActions,
} from '../controller'
import {
  isLeftLeg,
  isRightLeg,
  isRightArm,
  isLeftArm,
} from '../bodyFilters'

/**
 * Player controller system
 */
export class PlayerControllerSystem extends BaseSystem {
  private static readonly FORCE_LEFT = Vector.create(-0.005, 0)
  private static readonly FORCE_RIGHT = Vector.create(0.005, 0)
  private static readonly FORCE_UP = Vector.create(0, -0.005)
  private static readonly FORCE_DOWN = Vector.create(0, 0.005)

  public readonly signature = ComponentType.PHYSICS | ComponentType.PLAYER_CONTROLLER
  protected entitySystem: CES

  constructor(entitySystem: CES) {
    super()
    this.entitySystem = entitySystem
    this.processEntity = this.processEntity.bind(this)
  }

  private static moveLeftLeg(state: PlayerController['state'], ragdollBodies: Body[]) {
    if (state[PlayerActions.activateLeftFoot]) {
      const leftLeg = ragdollBodies.find(isLeftLeg)

      if (leftLeg !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(leftLeg, leftLeg.position, PlayerControllerSystem.FORCE_LEFT)
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(leftLeg, leftLeg.position, PlayerControllerSystem.FORCE_RIGHT)
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(leftLeg, leftLeg.position, PlayerControllerSystem.FORCE_UP)
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(leftLeg, leftLeg.position, PlayerControllerSystem.FORCE_DOWN)
        }
      }
    }
  }

  private static moveRightLeg(state: PlayerController['state'], ragdollBodies: Body[]) {
    if (state[PlayerActions.activateRightFoot]) {
      const rightLeg = ragdollBodies.find(isRightLeg)

      if (rightLeg !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(rightLeg, rightLeg.position, PlayerControllerSystem.FORCE_LEFT)
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(rightLeg, rightLeg.position, PlayerControllerSystem.FORCE_RIGHT)
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(rightLeg, rightLeg.position, PlayerControllerSystem.FORCE_UP)
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(rightLeg, rightLeg.position, PlayerControllerSystem.FORCE_DOWN)
        }
      }
    }
  }

  private static moveRightArm(state: PlayerController['state'], ragdollBodies: Body[]) {
    if (state[PlayerActions.activateRightHand]) {
      const rightArm = ragdollBodies.find(isRightArm)

      if (rightArm !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(rightArm, rightArm.position, PlayerControllerSystem.FORCE_LEFT)
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(rightArm, rightArm.position, PlayerControllerSystem.FORCE_RIGHT)
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(rightArm, rightArm.position, PlayerControllerSystem.FORCE_UP)
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(rightArm, rightArm.position, PlayerControllerSystem.FORCE_DOWN)
        }
      }
    }
  }

  private static moveLeftArm(state: PlayerController['state'], ragdollBodies: Body[]) {
    if (state[PlayerActions.activateLeftHand]) {
      const leftArm = ragdollBodies.find(isLeftArm)

      if (leftArm !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(leftArm, leftArm.position, PlayerControllerSystem.FORCE_LEFT)
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(leftArm, leftArm.position, PlayerControllerSystem.FORCE_RIGHT)
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(leftArm, leftArm.position, PlayerControllerSystem.FORCE_UP)
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(leftArm, leftArm.position, PlayerControllerSystem.FORCE_DOWN)
        }
      }
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

    // Move limbs based on player actions
    PlayerControllerSystem.moveLeftLeg(state, ragdollBodies)
    PlayerControllerSystem.moveRightLeg(state, ragdollBodies)
    PlayerControllerSystem.moveLeftArm(state, ragdollBodies)
    PlayerControllerSystem.moveRightArm(state, ragdollBodies)
  }
}
