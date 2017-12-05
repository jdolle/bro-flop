import {
  Bodies,
  World,
  IChamferableBodyDefinition,
  Composite,
} from 'matter-js'
import { CES } from '../ces'
import { PhysicsComponent } from '../ces/Components/PhysicsComponent'

export const createBoundaries = (entitySystem: CES, world: World, width: number, height: number) => {
  const entity = entitySystem.createEntity()

  const composite = Composite.create()

  // add barriers
  const groundThickness = 80
  const groundOptions: IChamferableBodyDefinition = {
    isStatic: true,
    restitution: 1,
    friction: 0,
    label: 'wall',
  }
  const ground = Bodies.rectangle(
    width / 2,
    height, // + groundThickness,
    width + groundThickness * 2,
    groundThickness,
    groundOptions,
  )

  const ceiling = Bodies.rectangle(
    width / 2,
    -groundThickness,
    width + groundThickness * 2,
    groundThickness,
    groundOptions,
  )

  const leftWall = Bodies.rectangle(
    -groundThickness,
    height / 2,
    groundThickness,
    height + groundThickness * 2,
    groundOptions,
  )

  const rightWall = Bodies.rectangle(
    width + groundThickness,
    height / 2,
    groundThickness,
    height + groundThickness * 2,
    groundOptions,
  )

  Composite.add(composite, ground)
  Composite.add(composite, leftWall)
  Composite.add(composite, rightWall)
  Composite.add(composite, ceiling)

  World.add(world, [composite])

  const p = PhysicsComponent.Create(composite)
  entitySystem.physics.add(entity, p)

  return entity
}
