/**
 * Unique identifier for each component type. Note that this is stored in the
 * `EntitySignatures`, so should max go up to FFFFFFFF and should be unique bit
 * masks.
 */
export enum ComponentType {
  POSITION = 1 << 0,
  PHYSICS = 1 << 1,
  PLAYER_CONTROLLER = 1 << 2,
  GRAPPLE = 1 << 3,
  SOUNDS = 1 << 4,
}
