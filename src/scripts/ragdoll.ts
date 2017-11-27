// tslint:disable max-func-body-length
import {
  Body,
  Bodies,
  Constraint,
  Vector,
  Composite,
} from 'matter-js'

const collisionFilter = () => {
  return {
    group: Body.nextGroup(true),
    category: 0x0001,
    mask: 0x0001,
  }
}

/**
 * Creates a ragdoll
 */
export const ragdoll = (x: number, y: number, scale: number = 1, options?: {}) => {

    const headOptions = {
      label: 'head',
      collisionFilter: collisionFilter(),
      chamfer: {
        radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale],
      },
      ...options,
    }

    const chestOptions = {
      label: 'chest',
      collisionFilter: collisionFilter(),
      // chamfer: {
      //   radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale],
      // },
      ...options,
    }

    const leftArmOptions = {
      label: 'leftArm',
      collisionFilter: collisionFilter(),
      // chamfer: {
      //   radius: 10 * scale,
      // },
      ...options,
    }

    const leftLowerArmOptions = {
      ...leftArmOptions,
      label: 'leftLowerArm',
    }

    const rightArmOptions = {
      label: 'rightArm',
      collisionFilter: collisionFilter(),
      // chamfer: {
      //   radius: 10 * scale,
      // },
      ...options,
    }

    const rightLowerArmOptions = {
      ...rightArmOptions,
      label: 'rightLowerArm',
    }

    const leftLegOptions = {
      label: 'leftLeg',
      collisionFilter: collisionFilter(),
      // chamfer: {
      //   radius: 10 * scale,
      // },
      ...options,
    }

    const leftLowerLegOptions = {
      ...leftLegOptions,
      label: 'leftLowerLeg',
    }

    const rightLegOptions = {
      label: 'rightLeg',
      collisionFilter: collisionFilter(),
      // chamfer: {
      //   radius: 10 * scale,
      // },
      ...options,
    }

    const rightLowerLegOptions = {
      ...rightLegOptions,
      label: 'rightLowerLeg',
    }

    const head = Bodies.rectangle(x, y - 60 * scale, 34 * scale, 40 * scale, headOptions)
    const chest = Bodies.rectangle(x, y, 55 * scale, 80 * scale, chestOptions)
    const rightUpperArm = Bodies.rectangle(x + 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, rightArmOptions)
    const rightLowerArm = Bodies.rectangle(x + 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, rightLowerArmOptions)
    const leftUpperArm = Bodies.rectangle(x - 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, leftArmOptions)
    const leftLowerArm = Bodies.rectangle(x - 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, leftLowerArmOptions)
    const leftUpperLeg = Bodies.rectangle(x - 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, leftLegOptions)
    const leftLowerLeg = Bodies.rectangle(x - 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, leftLowerLegOptions)
    const rightUpperLeg = Bodies.rectangle(x + 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, rightLegOptions)
    const rightLowerLeg = Bodies.rectangle(x + 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, rightLowerLegOptions)

    const chestToRightUpperArm = Constraint.create({
      bodyA: chest,
      pointA: Vector.create(24 * scale, -23 * scale),
      pointB: Vector.create(0, -8 * scale),
      bodyB: rightUpperArm,
      stiffness: 0.6,
    })

    const chestToLeftUpperArm = Constraint.create({
      bodyA: chest,
      pointA: Vector.create(-24 * scale, -23 * scale),
      pointB: Vector.create(0, -8 * scale),
      bodyB: leftUpperArm,
      stiffness: 0.6,
    })

    const chestToLeftUpperLeg = Constraint.create({
      bodyA: chest,
      pointA: Vector.create(-10 * scale, 30 * scale),
      pointB: Vector.create(0, -10 * scale),
      bodyB: leftUpperLeg,
      stiffness: 0.6,
    })

    const chestToRightUpperLeg = Constraint.create({
      bodyA: chest,
      pointA: Vector.create(10 * scale, 30 * scale),
      pointB: Vector.create(0, -10 * scale),
      bodyB: rightUpperLeg,
      stiffness: 0.6,
    })

    const upperToLowerRightArm = Constraint.create({
      bodyA: rightUpperArm,
      bodyB: rightLowerArm,
      pointA: Vector.create(0, 15 * scale),
      pointB: Vector.create(0, -25 * scale),
      stiffness: 0.6,
    })

    const upperToLowerLeftArm = Constraint.create({
      bodyA: leftUpperArm,
      bodyB: leftLowerArm,
      pointA: Vector.create(0, 15 * scale),
      pointB: Vector.create(0, -25 * scale),
      stiffness: 0.6,
    })

    const upperToLowerLeftLeg = Constraint.create({
      bodyA: leftUpperLeg,
      bodyB: leftLowerLeg,
      pointA: Vector.create(0, 20 * scale),
      pointB: Vector.create(0, -20 * scale),
      stiffness: 0.6,
    })

    const upperToLowerRightLeg = Constraint.create({
      bodyA: rightUpperLeg,
      bodyB: rightLowerLeg,
      pointA: Vector.create(0, 20 * scale),
      pointB: Vector.create(0, -20 * scale),
      stiffness: 0.6,
    })

    const headContraint = Constraint.create({
      bodyA: head,
      pointA: Vector.create(0, 25 * scale),
      pointB: Vector.create(0, -35 * scale),
      bodyB: chest,
      stiffness: 0.6,
    })

    // const legToLeg = Constraint.create({
    //   bodyA: leftLowerLeg,
    //   bodyB: rightLowerLeg,
    //   stiffness: 0.001,
    // })

    return Composite.create({
      bodies: [
        chest, head, leftLowerArm, leftUpperArm,
        rightLowerArm, rightUpperArm, leftLowerLeg,
        rightLowerLeg, leftUpperLeg, rightUpperLeg,
      ],
      constraints: [
        upperToLowerLeftArm, upperToLowerRightArm, chestToLeftUpperArm,
        chestToRightUpperArm, headContraint, upperToLowerLeftLeg,
        upperToLowerRightLeg, chestToLeftUpperLeg, chestToRightUpperLeg,
        // legToLeg,
      ],
    })
}
