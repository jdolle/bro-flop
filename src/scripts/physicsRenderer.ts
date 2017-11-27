import {
  World,
  Composite,
  Body,
  Constraint,
} from 'matter-js'
import { forEachRight } from 'lodash'

const boxesGfx = new PIXI.Graphics()
const constraintsGfx = new PIXI.Graphics()

export const drawWorld = (stage: PIXI.Container, world: World) => {
  boxesGfx.clear()
  constraintsGfx.clear()
  drawComposites(stage, world.composites)
  drawBodies(stage, world.bodies)
}

const bodyFillColor = (body: Body) => {
  if (body.isSleeping || body.isStatic) {
    return 0xaaaaaa
  } else if (body.isSensor) {
    return 0xffff00
  }

  return 0x00ff00
}

export const drawBodies = (stage: PIXI.Container, bodies: Body[]) => {
  boxesGfx.lineStyle(2, 0xff00ff)

  for (const body of bodies) {
    boxesGfx.beginFill(bodyFillColor(body), 0.5)
    boxesGfx.moveTo(body.vertices[0].x, body.vertices[0].y)
    forEachRight(body.vertices, (vert) => {
      boxesGfx.lineTo(vert.x, vert.y)
    })
    boxesGfx.endFill()
  }
  stage.addChild(boxesGfx)
}

export const drawComposites = (stage: PIXI.Container, composites: Composite[], showConstraints = true) => {
  for (const composite of composites) {
    drawBodies(stage, Composite.allBodies(composite))
    if (showConstraints === true) {
      drawConstraints(stage, Composite.allConstraints(composite))
    }
  }
}

export const drawConstraints = (stage: PIXI.Container, constraints: Constraint[]) => {
  constraintsGfx.clear()
  for (const constraint of constraints) {
    const { position: positionA } = constraint.bodyA
    const { position: positionB } = constraint.bodyB
    constraintsGfx.lineStyle(1, 0xffffff, 1)
    constraintsGfx.moveTo(positionA.x + constraint.pointA.x, positionA.y + constraint.pointA.y)
    constraintsGfx.lineTo(positionB.x + constraint.pointB.x, positionB.y + constraint.pointB.y)
  }
  stage.addChild(constraintsGfx)
}
