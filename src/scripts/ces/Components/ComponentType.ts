/**
 * Unique identifier for each component type. Note that this is stored in the
 * `EntitySignatures`, so should max go up to FFFFFFFF and should be unique bit
 * masks.
 */
export enum ComponentType {
  POSITION = 0x001,
  PHYSICS = 0x002,
  PLAYER_CONTROLLER = 0x004,
}
