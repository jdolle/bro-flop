import { default as keyboardJS } from 'keyboardjs'

export enum PlayerActions {
  activateLeftHand = '0',
  activateRightHand = '1',
  activateLeftFoot = '2',
  activateRightFoot = '3',
  moveLeft = '4',
  moveRight = '5',
  moveUp = '6',
  moveDown = '7',
}

type ActionsState =  {
  [action in PlayerActions]: boolean
}

export class PlayerController {
  private actionsState: ActionsState

  constructor() {
    this.actionsState = {
      [PlayerActions.activateLeftHand]: false,
      [PlayerActions.activateLeftFoot]: false,
      [PlayerActions.activateRightHand]: false,
      [PlayerActions.activateRightFoot]: false,
      [PlayerActions.moveUp]: false,
      [PlayerActions.moveDown]: false,
      [PlayerActions.moveRight]: false,
      [PlayerActions.moveLeft]: false,
    }
    this.init = this.init.bind(this)
  }

  public init(): PlayerController {
    const mappings = new Map([
      ['a', PlayerActions.activateLeftHand],
      ['s', PlayerActions.activateLeftFoot],
      ['d', PlayerActions.activateRightFoot],
      ['f', PlayerActions.activateRightHand],
      ['down', PlayerActions.moveDown],
      ['up', PlayerActions.moveUp],
      ['left', PlayerActions.moveLeft],
      ['right', PlayerActions.moveRight],
    ])

    for (const [key, action] of mappings) {
      const onPress = (e?: keyboardJS.KeyEvent) => {
        if (e !== undefined) {
          e.preventRepeat()
          e.preventDefault()
        }
        this.actionsState[action] = true
      }

      const onRelease = () => {
        this.actionsState[action] = false
      }

      keyboardJS.bind(key, onPress, onRelease)
    }

    keyboardJS.watch()

    return this
  }

  public get state(): Readonly<ActionsState> {
    return this.actionsState
  }

  public destroy() {
    keyboardJS.stop()
  }
}
