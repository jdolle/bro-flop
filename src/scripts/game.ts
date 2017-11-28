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
import { drawWorld, initRenderer } from './physicsRenderer'
import { ragdoll } from './ragdoll'

// NOTE needs to be in a component
let leftArmGrapple: Constraint | undefined
let rightArmGrapple: Constraint | undefined

const isRightLeg = (body: Body) => {
  return body.label === 'rightLowerLeg'
}
const isRightArm = (body: Body) => {
  return body.label === 'rightLowerArm'
}
const isLeftLeg = (body: Body) => {
  return body.label === 'leftLowerLeg'
}
const isLeftArm = (body: Body) => {
  return body.label === 'leftLowerArm'
}
const isChest = (body: Body) => {
  return body.label === 'chest'
}

/**
 * Game. Handles the game loop and entity systems creation
 */
export class Game {
  private static readonly FORCE_LEFT = Vector.create(-0.005, 0)
  private static readonly FORCE_RIGHT = Vector.create(0.005, 0)
  private static readonly FORCE_UP = Vector.create(0, -0.005)
  private static readonly FORCE_DOWN = Vector.create(0, 0.005)

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

  private playerController: PlayerController
  private playerRagdoll: Composite

  constructor() {
    this.update = this.update.bind(this)
    this.draw = this.draw.bind(this)
    this.gameLoop = this.gameLoop.bind(this)
  }

  public init() { // tslint:disable-line max-func-body-length
    // set up renderer
    this.stage = new PIXI.Container()
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

    initRenderer(this.stage)

    this.gameLoop()
  }

  public gameLoop() {
    requestAnimationFrame(this.gameLoop)
    this.update()
    this.draw()
  }

  public update() { // tslint:disable-line cyclomatic-complexity max-func-body-length
    const { state } = this.playerController
    const ragdollBodies = this.playerRagdoll.bodies

    // apply constant force to chest
    const chest = ragdollBodies.find(isChest)

    if (chest !== undefined) {
      const { gravity } = this.engine.world

      Game.tmpUpdateVectors[0].x = gravity.x * gravity.scale * -1.5
      Game.tmpUpdateVectors[0].y = gravity.y * gravity.scale * -1.5
      Body.applyForce(
        chest,
        chest.position,
        Game.tmpUpdateVectors[0],
      )
    }

    // Move limbs based on player actions
    if (state[PlayerActions.activateLeftFoot]) {
      const leftLeg = ragdollBodies.find(isLeftLeg)

      if (leftLeg !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(leftLeg, leftLeg.position, Game.FORCE_LEFT)
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(leftLeg, leftLeg.position, Game.FORCE_RIGHT)
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(leftLeg, leftLeg.position, Game.FORCE_UP)
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(leftLeg, leftLeg.position, Game.FORCE_DOWN)
        }
      }
    }

    if (state[PlayerActions.activateRightFoot]) {
      const rightLeg = ragdollBodies.find(isRightLeg)

      if (rightLeg !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(rightLeg, rightLeg.position, Game.FORCE_LEFT)
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(rightLeg, rightLeg.position, Game.FORCE_RIGHT)
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(rightLeg, rightLeg.position, Game.FORCE_UP)
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(rightLeg, rightLeg.position, Game.FORCE_DOWN)
        }
      }
    }

    if (state[PlayerActions.activateRightHand]) {
      const rightArm = ragdollBodies.find(isRightArm)

      if (rightArm !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(rightArm, rightArm.position, Game.FORCE_LEFT)
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(rightArm, rightArm.position, Game.FORCE_RIGHT)
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(rightArm, rightArm.position, Game.FORCE_UP)
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(rightArm, rightArm.position, Game.FORCE_DOWN)
        }
      }
    }

    if (state[PlayerActions.activateLeftHand]) {
      const leftArm = ragdollBodies.find(isLeftArm)

      if (leftArm !== undefined) {
        if (state[PlayerActions.moveLeft]) {
          Body.applyForce(leftArm, leftArm.position, Game.FORCE_LEFT)
        }

        if (state[PlayerActions.moveRight]) {
          Body.applyForce(leftArm, leftArm.position, Game.FORCE_RIGHT)
        }

        if (state[PlayerActions.moveUp]) {
          Body.applyForce(leftArm, leftArm.position, Game.FORCE_UP)
        }

        if (state[PlayerActions.moveDown]) {
          Body.applyForce(leftArm, leftArm.position, Game.FORCE_DOWN)
        }
      }
    }

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
}
