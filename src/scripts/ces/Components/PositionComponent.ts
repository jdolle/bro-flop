import { BaseComponent } from './BaseComponent'
import { ComponentType } from './ComponentType'

/**
 * A position component
 */
export class PositionComponent implements BaseComponent {
  public static readonly typeEnum: ComponentType = ComponentType.POSITION
  public readonly state: {
    x: number,
    y: number,
  }

  constructor(x = 0, y = 0) {
    this.state = {
      x,
      y,
    }
  }

  // Should use a pool
  public static Create(x: number = 0, y: number = 0): PositionComponent {
    return new PositionComponent(x, y)
  }

  public static Release(component: PositionComponent) {
    return true
  }
}
