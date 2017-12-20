import {
  Engine,
  Vector,
  Constraint,
  World,
  Composite,
  IPair,
  IVertex,
  Body,
} from 'matter-js'

import { BaseSystem } from '../ces/BaseSystem'
import { Entity } from '../ces/Entity'
import { PhysicsComponent } from '../ces/Components/PhysicsComponent'
import { GrappleComponent } from '../ces/Components/GrappleComponent'
import { CES } from '../ces/'
import { EventQueue } from '../EventQueue'
import {
  isLeftHand,
  isRightHand,
} from '../bodyFilters'

const MAX_GRAPPLE_DISTANCE = 3.5

// pool of vectors for use in #update(). Not thread safe.
const tmpUpdateVectors = [
  Vector.create(),
  Vector.create(),
  Vector.create(),
  Vector.create(),
]

/**
 * Grapple system
 */
export class GrappleSystem extends BaseSystem {
  public readonly signature = PhysicsComponent.typeEnum | GrappleComponent.typeEnum
  protected entitySystem: CES
  private engine: Engine
  private eventQueue: EventQueue

  constructor(entitySystem: CES, engine: Engine, eventQueue: EventQueue) {
    super()
    this.entitySystem = entitySystem
    this.engine = engine
    this.eventQueue = eventQueue

    this.processEntity = this.processEntity.bind(this)
  }

  private static isStretchedTooFar(constraint: Constraint) {
    const { bodyA, pointA, bodyB, pointB } = constraint

    const pointAWorld = Vector.add(bodyA.position, pointA, tmpUpdateVectors[1])
    const pointBWorld = Vector.add(bodyB.position, pointB, tmpUpdateVectors[2])

    const delta = Vector.sub(pointAWorld, pointBWorld, tmpUpdateVectors[3])
    const currentLength = Vector.magnitude(delta)

    return currentLength > MAX_GRAPPLE_DISTANCE
  }

  private static grappleConstraint(engine: Engine, vert: IVertex, bodyA: Body, bodyB: Body) {
    const constraint = Constraint.create({
      label: 'grapple',
      bodyA,
      bodyB,
      pointA: Vector.sub(vert, bodyA.position),
      pointB: Vector.sub(vert, bodyB.position),
      stiffness: 0.25,
    })

    World.add(engine.world, constraint)

    return constraint
  }

  private static collidesWithSelf(composite: Composite, pair: IPair) {
    return composite.bodies.includes(pair.bodyA) && composite.bodies.includes(pair.bodyB)
  }

  private static collidesWithWall(pair: IPair) {
    return pair.bodyA.label === 'wall' || pair.bodyB.label === 'wall'
  }

  public onEntityRemoved(entity: Entity) {
    const physics = this.entitySystem.physics.find(entity)
    const grapple = this.entitySystem.grapples.find(entity)

    if (physics !== undefined) {
      const { composite } = physics.state

      if (composite !== undefined) {
        composite.bodies.forEach((body) => {
          if (isLeftHand(body) || isRightHand(body)) {
            body.onCollide(undefined)
          }
        })
      }
    }

    if (grapple !== undefined) {
      if (grapple.state.leftArmGrapple !== undefined) {
        Composite.remove(this.engine.world, grapple.state.leftArmGrapple)
        grapple.state.leftArmGrapple = undefined
      }

      if (grapple.state.rightArmGrapple !== undefined) {
        Composite.remove(this.engine.world, grapple.state.rightArmGrapple)
        grapple.state.rightArmGrapple = undefined
      }
    }
  }

  /**
   * Adds a collision listener to the body of left and right arms when the entity
   * is added. WARNING: This won't catch if the arm is added after the system
   * adds the entity...
   */
  public onEntityAdded(entity: Entity) {
    const physics = this.entitySystem.physics.find(entity)
    const grapple = this.entitySystem.grapples.find(entity)

    if (physics === undefined) {
      return
    }

    if (grapple === undefined) {
      return
    }

    const { composite } = physics.state

    if (composite === undefined) {
      return
    }

    composite.bodies.forEach((body) => {
      if (isLeftHand(body)) {
        body.onCollide((pair: IPair) => {
          // if (GrappleSystem.collidesWithWall(pair)) {
          //   return
          // }

          if (GrappleSystem.collidesWithSelf(composite, pair)) {
            return
          }

          if (grapple.state.leftArmGrapple !== undefined) {
            return
          }

          const constraint = GrappleSystem.grappleConstraint(
            this.engine,
            pair.activeContacts[0].vertex,
            pair.bodyA,
            pair.bodyB,
          )

          grapple.state.leftArmGrapple = constraint
        })
      } else if (isRightHand(body)) {
        body.onCollide((pair: IPair) => {
          // if (GrappleSystem.collidesWithWall(pair)) {
          //   return
          // }

          if (GrappleSystem.collidesWithSelf(composite, pair)) {
            return
          }

          if (grapple.state.rightArmGrapple !== undefined) {
            return
          }

          const constraint = GrappleSystem.grappleConstraint(
            this.engine,
            pair.activeContacts[0].vertex,
            pair.bodyA,
            pair.bodyB,
          )

          grapple.state.rightArmGrapple = constraint
        })
      }
    })
  }

  public process(): void {
    this.entitySystem.entitySignatures.forEach(this.processEntity, this.signature)
  }

  protected processEntity(entity: Entity): void {
    const grapple = this.entitySystem.grapples.find(entity)

    if (grapple === undefined) {
      return
    }

    // if the player is grabbing something, check if the grip should be
    // removed based on distance (which is based on how much force the player is
    // applying away from the grabbed body.

    const { leftArmGrapple, rightArmGrapple } = grapple.state
    if (leftArmGrapple !== undefined && GrappleSystem.isStretchedTooFar(leftArmGrapple)) {
      Composite.remove(this.engine.world, leftArmGrapple)
      grapple.state.leftArmGrapple = undefined
      this.eventQueue.dispatch(entity, 'grapple_release')
    }

    if (rightArmGrapple !== undefined && GrappleSystem.isStretchedTooFar(rightArmGrapple)) {
      Composite.remove(this.engine.world, rightArmGrapple)
      grapple.state.rightArmGrapple = undefined
      this.eventQueue.dispatch(entity, 'grapple_release')
    }
  }
}
