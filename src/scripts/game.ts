/**
 * The game.
 */

import * as PIXI from 'pixi.js'
import {
  Engine,
  World,
  Bodies,
  Composite,
} from 'matter-js'

import { drawWorld } from './physicsRenderer'
import { ragdoll } from './ragdoll'

/**
 * Game. Handles the game loop and entity systems creation
 */
export class Game {
  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer
  private engine: Engine

  constructor() {
    this.update = this.update.bind(this)
    this.draw = this.draw.bind(this)
    this.gameLoop = this.gameLoop.bind(this)
  }

  public begin() {
    // set up physics engine
    this.engine = Engine.create({
      enableSleeping: true,
    })

    const ground = Bodies.rectangle(200, 400, 400, 80, {
      isStatic: true,
      friction: 0.8,
    })

    const ragdolls = Composite.create()

    Composite.add(ragdolls, ragdoll(100, 200, 0.5, {
      friction: 0.8,
    }))

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

  public update() {
    Engine.update(this.engine)
  }

  public draw() {
    const stage = new PIXI.Container()

    drawWorld(stage, this.engine.world)

    this.renderer.render(stage)
  }
}
