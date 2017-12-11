import {
  Constraint,
  World,
} from 'matter-js'
import { BaseComponent } from './BaseComponent'
import { ComponentType } from './ComponentType'

/**
 * A position component
 */
export class GrappleComponent implements BaseComponent {
  public static readonly typeEnum: ComponentType = ComponentType.GRAPPLE
  public readonly state: {
    leftArmGrapple?: Constraint,
    rightArmGrapple?: Constraint,
  }

  constructor() {
    this.state = {
      leftArmGrapple: undefined,
      rightArmGrapple: undefined,
    }
  }

  // Should use a pool
  public static Create(): GrappleComponent {
    return new GrappleComponent()
  }

  public static Release(component: GrappleComponent, world: World) {
    if (component.state.leftArmGrapple !== undefined) {
      World.remove(world, component.state.leftArmGrapple)
    }

    return true
  }
}
