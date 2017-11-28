import {
  World,
  Composite,
  Body,
  Constraint,
} from 'matter-js'

const boxesGfx = new PIXI.Graphics()
const constraintsGfx = new PIXI.Graphics()

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
    boxesGfx.moveTo(body.vertices[body.vertices.length - 1].x, body.vertices[body.vertices.length - 1].y)
    for (const vert of body.vertices) {
      boxesGfx.lineTo(vert.x, vert.y)
    }
    boxesGfx.endFill()
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
}

export const drawComposites = (stage: PIXI.Container, composites: Composite[], showConstraints = true) => {
  for (const composite of composites) {
    drawBodies(stage, composite.bodies)
    if (showConstraints === true) {
      drawConstraints(stage, composite.constraints)
    }

    if (composite.composites.length > 0) {
      drawComposites(stage, composite.composites, showConstraints)
    }
  }
}

export const initRenderer = (stage: PIXI.Container) => {
  stage.addChild(boxesGfx)
  stage.addChild(constraintsGfx)
}

export const drawWorld = (stage: PIXI.Container, world: World) => {
  boxesGfx.clear()
  constraintsGfx.clear()
  drawComposites(stage, world.composites)
  drawBodies(stage, world.bodies)
}
