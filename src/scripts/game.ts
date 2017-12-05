/**
 * The game.
 */

import * as PIXI from 'pixi.js'
import {
  Engine,
  World,
  Composite,
  Vector,
  Events,
  Constraint,
} from 'matter-js'

import { PhysicsSystem } from './Systems/PhysicsSystem'
import { PlayerControllerSystem } from './Systems/PlayerControllerSystem'
import { createPlayer } from './Factories/PlayerFactory'
import { createBoundaries } from './Factories/BoundariesFactory'
import { drawWorld, initRenderer } from './physicsRenderer'
import { CES } from './ces'

// NOTE needs to be in a component
let leftArmGrapple: Constraint | undefined
let rightArmGrapple: Constraint | undefined

/**
 * Game. Handles the game loop and entity systems creation
 */
export class Game {
  // pool of vectors for use in #update(). Not thread safe.
  private static tmpUpdateVectors = [
    Vector.create(),
    Vector.create(),
    Vector.create(),
    Vector.create(),
  ]

  private stage: PIXI.Container
  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer
  private engine: Engine
  private entitySystem: CES
  private physicsSystem: PhysicsSystem
  private playerControllerSystem: PlayerControllerSystem

  constructor() {
    this.renderer = PIXI.autoDetectRenderer(512, 512)
    this.stage = new PIXI.Container()
    this.engine = Engine.create({ enableSleeping: true })
    this.engine.world.gravity.scale *= -2 // reverse gravity
    this.entitySystem = new CES()

    // set up systems
    this.physicsSystem = new PhysicsSystem(this.entitySystem, this.engine.world)
    this.playerControllerSystem = new PlayerControllerSystem(this.entitySystem)

    this.update = this.update.bind(this)
    this.draw = this.draw.bind(this)
    this.gameLoop = this.gameLoop.bind(this)
  }

  public init() {
    document.body.appendChild(this.renderer.view)

    // Grapple logic
    Events.on(this.engine, 'collisionStart', (event) => {
      const { pairs } = event
      for (const pair of pairs) {
        if (pair.bodyB.label === 'wall') {
          const isLeftArmA = pair.bodyA.label === 'leftLowerArm'
          const isRightArmA = pair.bodyA.label === 'rightLowerArm'

          if (isLeftArmA && leftArmGrapple !== undefined) {
            return
          }

          if (isRightArmA && rightArmGrapple !== undefined) {
            return
          }

          if (isLeftArmA || isRightArmA) {
            const constraint = Constraint.create({
              label: 'grapple',
              bodyA: pair.bodyA,
              bodyB: pair.bodyB,
              pointA: Vector.sub(pair.activeContacts[0].vertex, pair.bodyA.position),
              pointB: Vector.sub(pair.activeContacts[0].vertex, pair.bodyB.position),
              stiffness: 0.2,
            })
            World.add(this.engine.world, constraint)

            if (isLeftArmA) {
              leftArmGrapple = constraint
            } else if (isRightArmA) {
              rightArmGrapple = constraint
            }
          }
        } else if (pair.bodyA.label === 'wall') {
          const isLeftArmB = pair.bodyB.label === 'leftLowerArm'
          const isRightArmB = pair.bodyB.label === 'rightLowerArm'

          if (isLeftArmB && leftArmGrapple !== undefined) {
            return
          }

          if (isRightArmB && rightArmGrapple !== undefined) {
            return
          }

          if (isLeftArmB || isRightArmB) {
            const constraint = Constraint.create({
              label: 'grapple',
              bodyA: pair.bodyA,
              bodyB: pair.bodyB,
              pointA: Vector.sub(pair.activeContacts[0].vertex, pair.bodyA.position),
              pointB: Vector.sub(pair.activeContacts[0].vertex, pair.bodyB.position),
              stiffness: 0.2,
            })
            World.add(this.engine.world, constraint)

            if (isLeftArmB) {
              leftArmGrapple = constraint
            } else if (isRightArmB) {
              rightArmGrapple = constraint
            }
          }
        }
      }
    })

    initRenderer(this.stage)

    createPlayer(this.entitySystem, this.engine.world)
    createBoundaries(this.entitySystem, this.engine.world, this.renderer.width, this.renderer.height)

    this.gameLoop()
  }

  public update() {
    this.physicsSystem.process()
    this.playerControllerSystem.process()

    // if the player is grabbing something, check if the grip should be
    // removed based on distance (which is based on how much force the player is
    // applying away from the grabbed body.
    for (const constraint of this.engine.world.constraints) {
      if (constraint.label === 'grapple') {
        const { bodyA, pointA, bodyB, pointB } = constraint

        const pointAWorld = Vector.add(bodyA.position, pointA, Game.tmpUpdateVectors[1])
        const pointBWorld = Vector.add(bodyB.position, pointB, Game.tmpUpdateVectors[2])

        const delta = Vector.sub(pointAWorld, pointBWorld, Game.tmpUpdateVectors[3])
        const currentLength = Vector.magnitude(delta)

        if (currentLength > 3) {
          if (bodyA.label === 'leftLowerArm') {
            leftArmGrapple = undefined
          }
          if (bodyA.label === 'rightLowerArm') {
            rightArmGrapple = undefined
          }
          Composite.remove(this.engine.world, constraint)
        }
      }
    }

    Engine.update(this.engine, 1000 / 200)
  }

  public draw() {
    drawWorld(this.stage, this.engine.world)
    this.renderer.render(this.stage)
  }

  private gameLoop() {
    requestAnimationFrame(this.gameLoop)
    this.update()
    this.draw()
  }
}
