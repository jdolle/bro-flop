import { Body } from 'matter-js'

/**
 * Helpers for finding specific physics bodies
 */

export const isRightLeg = (body: Body) => {
  return body.label === 'rightLowerLeg'
}

export const isRightArm = (body: Body) => {
  return body.label === 'rightLowerArm'
}

export const isLeftLeg = (body: Body) => {
  return body.label === 'leftLowerLeg'
}

export const isLeftArm = (body: Body) => {
  return body.label === 'leftLowerArm'
}

export const isLeftHand = (body: Body) => {
  return body.label === 'leftHand'
}

export const isRightHand = (body: Body) => {
  return body.label === 'rightHand'
}

export const isChest = (body: Body) => {
  return body.label === 'chest'
}
