import {
  World,
  Composite,
  Body,
  Constraint,
} from 'matter-js'
import { forEachRight } from 'lodash'

export const drawWorld = (stage: PIXI.Container, world: World) => {
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
  for (const body of bodies) {
    const box = new PIXI.Graphics()

    box.lineStyle(2, 0xff00ff)
    box.beginFill(bodyFillColor(body), 0.5)
    box.moveTo(body.vertices[0].x, body.vertices[0].y)
    forEachRight(body.vertices, (vert) => {
      box.lineTo(vert.x, vert.y)
    })
    box.endFill()
    stage.addChild(box)
  }
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
  for (const constraint of constraints) {
    const { position: positionA } = constraint.bodyA
    const { position: positionB } = constraint.bodyB
    const graphic = new PIXI.Graphics()
    graphic.lineStyle(1, 0xffffff, 1)
    graphic.moveTo(positionA.x + constraint.pointA.x, positionA.y + constraint.pointA.y)
    graphic.lineTo(positionB.x + constraint.pointB.x, positionB.y + constraint.pointB.y)
    stage.addChild(graphic)
  }
}
