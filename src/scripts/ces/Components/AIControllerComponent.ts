import { BaseComponent } from './BaseComponent'
import { ComponentType } from './ComponentType'

/**
 * A position component
 */
export class AIControllerComponent implements BaseComponent {
  public static readonly typeEnum: ComponentType = ComponentType.AI_CONTROLLER
  public readonly state: {}

  constructor() {
    this.state = {}
  }

  // Should use a pool
  public static Create(): AIControllerComponent {
    return new AIControllerComponent()
  }

  public static Release(_component: AIControllerComponent) {
    return true
  }
}
