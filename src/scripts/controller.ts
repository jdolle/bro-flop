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

type ActionsState = {
  [action in PlayerActions]: boolean
}

type ActionMapping = [string, PlayerActions][]

const PlayerOneMappings: ActionMapping = [
  ['1', PlayerActions.activateLeftHand],
  ['2', PlayerActions.activateLeftFoot],
  ['3', PlayerActions.activateRightFoot],
  ['4', PlayerActions.activateRightHand],
  ['x', PlayerActions.moveDown],
  ['s', PlayerActions.moveUp],
  ['z', PlayerActions.moveLeft],
  ['c', PlayerActions.moveRight],
]

const PlayerTwoMappings: ActionMapping = [
  ['9', PlayerActions.activateLeftHand],
  ['0', PlayerActions.activateLeftFoot],
  ['-', PlayerActions.activateRightFoot],
  ['=', PlayerActions.activateRightHand],
  ['down', PlayerActions.moveDown],
  ['up', PlayerActions.moveUp],
  ['left', PlayerActions.moveLeft],
  ['right', PlayerActions.moveRight],
]

const defaultMappings: ActionMapping[] = [
  PlayerOneMappings,
  PlayerTwoMappings,
]

/**
 * Maps keystates to player action states
 */
export class PlayerController {
  private static PlayerNumber = 0
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

  public init(mappingArg?: ActionMapping): PlayerController {
    let mapping = mappingArg
    if (mappingArg === undefined) {
      mapping = defaultMappings[PlayerController.PlayerNumber]
      PlayerController.PlayerNumber += 1
    }
    const mappings = new Map<string, PlayerActions>(mapping)

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
