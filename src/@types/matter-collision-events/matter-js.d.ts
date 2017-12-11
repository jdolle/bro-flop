/**
 * Typings for matter-collision-events https://github.com/dxu/matter-collision-events
 */

import { IPair } from 'matter-js'

declare module 'matter-js' {
  export interface Body {
    onCollide(callback?: (pair: IPair) => void): void
    onCollideEnd(callback?: (pair: IPair) => void): void
    onCollideActive(callback?: (pair: IPair) => void): void
  }
}
