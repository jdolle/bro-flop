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
} from 'matter-js'

import { PlayerController, PlayerActions } from './controller'
import { drawWorld } from './physicsRenderer'
import { ragdoll } from './ragdoll'

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

  public init() {
    // set up physics engine
    this.engine = Engine.create({
      enableSleeping: true,
    })

    this.playerController = new PlayerController().init()

    const ground = Bodies.rectangle(200, 400, 400, 80, {
      isStatic: true,
      friction: 0.8,
    })

    const ragdolls = Composite.create()
    this.playerRagdoll = ragdoll(100, 200, 0.5, {
      friction: 0.8,
    })

    Composite.add(ragdolls, this.playerRagdoll)

    World.add(this.engine.world, [ground, ragdolls])

    // set up renderer
    this.renderer = PIXI.autoDetectRenderer(512, 512)
    document.body.appendChild(this.renderer.view)

    this.gameLoop()
  }

  public gameLoop() {
    requestAnimationFrame(this.gameLoop)
    this.update()
    this.draw()
  }

  // tslint:disable-next-line cyclomatic-complexity
  public update() {
    Engine.update(this.engine, 1000 / 200)

    const { state } = this.playerController
    if (state[PlayerActions.activateLeftFoot]) {
      const leftLeg = Composite.allBodies(this.playerRagdoll).find((body) => {
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
      const rightLeg = Composite.allBodies(this.playerRagdoll).find((body) => {
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
      const rightArm = Composite.allBodies(this.playerRagdoll).find((body) => {
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
      const leftArm = Composite.allBodies(this.playerRagdoll).find((body) => {
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
  }

  public draw() {
    const stage = new PIXI.Container()

    drawWorld(stage, this.engine.world)

    this.renderer.render(stage)
  }
}
