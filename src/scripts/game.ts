/**
 * The game.
 */

import * as PIXI from 'pixi.js'
import * as Matter from 'matter-js'
import { MatterCollisionEvents } from 'matter-collision-events'

import { PhysicsSystem } from './Systems/PhysicsSystem'
import { PlayerControllerSystem } from './Systems/PlayerControllerSystem'
import { GrappleSystem } from './Systems/GrappleSystem'
import { SoundsSystem } from './Systems/SoundsSystem'
import { createPlayer } from './Factories/PlayerFactory'
import { createBoundaries } from './Factories/BoundariesFactory'
import { drawWorld, initRenderer } from './physicsRenderer'
import { CES } from './ces'
import { EventQueue } from './EventQueue'

/**
 * Game. Handles the game loop and entity systems creation
 */
export class Game {
  private stage: PIXI.Container
  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer
  private engine: Matter.Engine
  private entitySystem: CES
  private eventQueue: EventQueue

  constructor() {
    this.renderer = PIXI.autoDetectRenderer(512, 512)
    this.stage = new PIXI.Container()
    Matter.Plugin.register(MatterCollisionEvents)
    Matter.Plugin.use(Matter, 'matter-collision-events')
    this.engine = Matter.Engine.create({ enableSleeping: true })
    this.engine.world.gravity.scale *= -2 // reverse gravity
    this.eventQueue = new EventQueue()
    this.entitySystem = new CES()

    // set up systems
    this.entitySystem.addSystem(new PhysicsSystem(this.entitySystem, this.engine.world))
    this.entitySystem.addSystem(new PlayerControllerSystem(this.entitySystem))
    this.entitySystem.addSystem(new GrappleSystem(this.entitySystem, this.engine, this.eventQueue))
    this.entitySystem.addSystem(new SoundsSystem(this.entitySystem, this.eventQueue))

    this.update = this.update.bind(this)
    this.draw = this.draw.bind(this)
    this.gameLoop = this.gameLoop.bind(this)
  }

  public init() {
    document.body.appendChild(this.renderer.view)

    initRenderer(this.stage)

    createPlayer(this.entitySystem, this.engine.world)
    createBoundaries(this.entitySystem, this.engine.world, this.renderer.width, this.renderer.height)

    this.gameLoop()
  }

  public update() {
    this.entitySystem.process()

    Matter.Engine.update(this.engine, 1000 / 200)
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
