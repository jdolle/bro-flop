import { BaseComponent } from './BaseComponent'
import { ComponentType } from './ComponentType'
import { PlayerController } from '../../controller'

/**
 * A position component
 */
export class PlayerControllerComponent implements BaseComponent {
  public static readonly typeEnum: ComponentType = ComponentType.PLAYER_CONTROLLER
  public readonly state: {
    playerController: PlayerController,
  }

  constructor() {
    this.state = {
      playerController: new PlayerController().init(),
    }
  }

  // Should use a pool
  public static Create(): PlayerControllerComponent {
    return new PlayerControllerComponent()
  }

  public static Release(component: PlayerControllerComponent) {
    return true
  }
}
