import { BaseComponent } from './BaseComponent'
import { ComponentType } from './ComponentType'
import {
  Composite,
} from 'matter-js'

/**
 * A position component
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

  public static Release(component: PhysicsComponent) {
    return true
  }
}
