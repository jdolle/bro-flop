import { BaseComponent } from './BaseComponent'
import { ComponentType } from './ComponentType'
import {
  Composite,
  World,
} from 'matter-js'

/**
 * Physics component - This hooks in to the physics engine via a composite.
 * It is important to
 */
export class PhysicsComponent implements BaseComponent {
  public static readonly typeEnum: ComponentType = ComponentType.PHYSICS
  public readonly state: {
    composite?: Composite,
  }

  constructor(composite?: Composite) {
    this.state = {
      composite,
    }
  }

  // Should use a pool
  public static Create(composite?: Composite): PhysicsComponent {
    return new PhysicsComponent(composite)
  }

  public static Release(component: PhysicsComponent, world: World) {
    const { composite } = component.state
    if (composite === undefined) {
      return false
    }

    World.remove(world, composite, true)

    return true
  }
}
