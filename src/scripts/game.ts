/**
 * The game.
 */

import * as PIXI from 'pixi.js'
import {
  Engine,
  World,
  Bodies,
  Body,
  Composite,
  Vector,
  Events,
  IChamferableBodyDefinition,
  Constraint,
} from 'matter-js'

import { PlayerController, PlayerActions } from './controller'
import { drawWorld } from './physicsRenderer'
import { ragdoll } from './ragdoll'

// NOTE needs to be in a component
let leftArmGrapple: Constraint | undefined
let rightArmGrapple: Constraint | undefined

/**
 * Game. Handles the game loop and entity systems creation
 */
export class Game {
  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer
  private engine: Engine

  private playerController: PlayerController
  private playerRagdoll: Composite

  constructor() {
    this.update = this.update.bind(this)
    this.draw = this.draw.bind(this)
    this.gameLoop = this.gameLoop.bind(this)
  }

  // tslint:disable-next-line max-func-body-length
  public init() {
    // set up renderer
    this.renderer = PIXI.autoDetectRenderer(512, 512)
    document.body.appendChild(this.renderer.view)

    // set up physics engine
    this.engine = Engine.create({
      enableSleeping: true,
    })

    this.playerController = new PlayerController().init()

    // add character
    const ragdolls = Composite.create()
    this.playerRagdoll = ragdoll(100, 200, 0.5, {
      friction: 0.5,
      frictionAir: 0.02,
    })

    Composite.add(ragdolls, this.playerRagdoll)

    // add barriers
    const groundThickness = 80
    const groundOptions: IChamferableBodyDefinition = {
      isStatic: true,
      restitution: 1,
      friction: 0,
      label: 'wall',
    }
    const ground = Bodies.rectangle(
      this.renderer.width / 2,
      this.renderer.height, // + groundThickness,
      this.renderer.width + groundThickness * 2,
      groundThickness,
      groundOptions,
    )

    const ceiling = Bodies.rectangle(
      this.renderer.width / 2,
      -groundThickness,
      this.renderer.width + groundThickness * 2,
      groundThickness,
      groundOptions,
    )

    const leftWall = Bodies.rectangle(
      -groundThickness,
      this.renderer.height / 2,
      groundThickness,
      this.renderer.height + groundThickness * 2,
      groundOptions,
    )

    const rightWall = Bodies.rectangle(
      this.renderer.width + groundThickness,
      this.renderer.height / 2,
      groundThickness,
      this.renderer.height + groundThickness * 2,
      groundOptions,
    )

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

    this.engine.world.gravity.scale *= -2 // reverse gravity

    World.add(this.engine.world, [ground, leftWall, rightWall, ceiling, ragdolls])

    this.gameLoop()
  }

  public gameLoop() {
    requestAnimationFrame(this.gameLoop)
    this.update()
    this.draw()
  }

  // tslint:disable-next-line cyclomatic-complexity max-func-body-length
  public update() {
    const { state } = this.playerController
    const ragdollBodies = Composite.allBodies(this.playerRagdoll)

    // apply constant force to chest
    const chest = ragdollBodies.find((body) => {
      return body.label === 'chest'
    })

    if (chest !== undefined) {
      const { gravity } = this.engine.world

      Body.applyForce(
        chest,
        chest.position,
        Vector.create(gravity.x * gravity.scale * -1.5, gravity.y * gravity.scale * -1.5),
      )
    }

    // Move limbs based on player actions
    if (state[PlayerActions.activateLeftFoot]) {
      const leftLeg = ragdollBodies.find((body) => {
        return body.label === 'leftLowerLeg'
      })

      if (leftLeg !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(leftLeg, leftLeg.position, Vector.create(-0.005, 0))
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(leftLeg, leftLeg.position, Vector.create(0.005, 0))
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(leftLeg, leftLeg.position, Vector.create(0, -0.005))
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(leftLeg, leftLeg.position, Vector.create(0, 0.005))
        }
      }
    }

    if (state[PlayerActions.activateRightFoot]) {
      const rightLeg = ragdollBodies.find((body) => {
        return body.label === 'rightLowerLeg'
      })

      if (rightLeg !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(rightLeg, rightLeg.position, Vector.create(-0.005, 0))
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(rightLeg, rightLeg.position, Vector.create(0.005, 0))
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(rightLeg, rightLeg.position, Vector.create(0, -0.005))
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(rightLeg, rightLeg.position, Vector.create(0, 0.005))
        }
      }
    }

    if (state[PlayerActions.activateRightHand]) {
      const rightArm = ragdollBodies.find((body) => {
        return body.label === 'rightLowerArm'
      })

      if (rightArm !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(rightArm, rightArm.position, Vector.create(-0.005, 0))
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(rightArm, rightArm.position, Vector.create(0.005, 0))
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(rightArm, rightArm.position, Vector.create(0, -0.005))
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(rightArm, rightArm.position, Vector.create(0, 0.005))
        }
      }
    }

    if (state[PlayerActions.activateLeftHand]) {
      const leftArm = ragdollBodies.find((body) => {
        return body.label === 'leftLowerArm'
      })

      if (leftArm !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(leftArm, leftArm.position, Vector.create(-0.005, 0))
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(leftArm, leftArm.position, Vector.create(0.005, 0))
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(leftArm, leftArm.position, Vector.create(0, -0.005))
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(leftArm, leftArm.position, Vector.create(0, 0.005))
        }
      }
    }

    // if the player is grabbing something, check if the grip should be
    // removed based on distance (which is based on how much force the player is
    // applying away from the grabbed body.
    for (const constraint of this.engine.world.constraints) {
      if (constraint.label === 'grapple') {
        const { bodyA, pointA, bodyB, pointB } = constraint

        const pointAWorld = Vector.add(bodyA.position, pointA)
        const pointBWorld = Vector.add(bodyB.position, pointB)

        if (!pointAWorld || !pointBWorld) {
          return
        }

        const delta = Vector.sub(pointAWorld, pointBWorld)
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
    const stage = new PIXI.Container()

    drawWorld(stage, this.engine.world)

    this.renderer.render(stage)
  }
}
