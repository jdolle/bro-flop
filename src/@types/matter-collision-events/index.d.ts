/**
 * Typings for matter-collision-events https://github.com/dxu/matter-collision-events
 */

declare module 'matter-collision-events' {
  type Plugin = {
    name: string,
    version: string,
    install(matterModule: object): void,
  }

  const plugin: {
    MatterCollisionEvents: Plugin,
  }
  export = plugin
}
