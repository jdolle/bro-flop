import {
  Vector,
} from 'matter-js'

import { CES } from '../ces/'
import { Entity } from '../ces/Entity'
import { ComponentType } from '../ces/Components/ComponentType'
import { BaseSystem } from '../ces/BaseSystem'
import { PlayerActions } from '../controller'
import {
//   isRightHand,
//   isLeftHand,
  isChest,
} from '../bodyFilters'

/**
 * AI controller system
 */
export class AIControllerSystem extends BaseSystem {
  private static tmpVector = Vector.create()
  private static closestDiff = Vector.create()

  public readonly signature = ComponentType.PHYSICS | ComponentType.PLAYER_CONTROLLER | ComponentType.AI_CONTROLLER
  protected entitySystem: CES

  constructor(entitySystem: CES) {
    super()
    this.entitySystem = entitySystem
    this.processEntity = this.processEntity.bind(this)
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

    // Ignorantly activate only hands and go towards the enemy
    const { composite }  = physics.state

    if (composite === undefined) {
      return
    }

    const chest = composite.bodies.find(isChest)

    if (chest === undefined) {
      return
    }

    let closestEntityDistanceSquared: number = Infinity

    this.entitySystem.entitySignatures.forEach(
      (otherEntity: Entity) => {
        if (otherEntity !== entity) {
          const otherPhysics = this.entitySystem.physics.find(otherEntity)

          if (otherPhysics !== undefined && otherPhysics.state.composite !== undefined) {
            const { composite: otherComposite } = otherPhysics.state

            if (otherComposite !== undefined) {
              const otherChest = otherComposite.bodies.find(isChest)

              if (otherChest !== undefined) {
                // get closest entity
                Vector.sub(otherChest.position, chest.position, AIControllerSystem.tmpVector)
                const dsq = Vector.magnitudeSquared(AIControllerSystem.tmpVector)
                if (dsq < closestEntityDistanceSquared) {
                  AIControllerSystem.closestDiff.x = AIControllerSystem.tmpVector.x
                  AIControllerSystem.closestDiff.y = AIControllerSystem.tmpVector.y
                  closestEntityDistanceSquared = dsq
                  // closestEntity = otherEntity
                }
              }
            }
          }
        }
      },
      ComponentType.PHYSICS,
    )

    const { setState } = controller.state.playerController

    // reset controller
    setState(PlayerActions.activateLeftHand, false)
    setState(PlayerActions.activateLeftFoot, false)
    setState(PlayerActions.activateRightHand, false)
    setState(PlayerActions.activateRightFoot, false)
    setState(PlayerActions.moveUp, false)
    setState(PlayerActions.moveDown, false)
    setState(PlayerActions.moveRight, false)
    setState(PlayerActions.moveLeft, false)

    // now adjust controlls via AI
    if (AIControllerSystem.closestDiff !== undefined) {
      setState(PlayerActions.activateRightHand, true)
      setState(PlayerActions.activateLeftHand, true)

      if (AIControllerSystem.closestDiff.x > 0) {
        setState(PlayerActions.moveRight, true)
      } else {
        setState(PlayerActions.moveLeft, true)
      }

      if (AIControllerSystem.closestDiff.y > 0)  {
        setState(PlayerActions.moveDown, true)
      } else {
        setState(PlayerActions.moveUp, true)
      }
    }
  }
}
