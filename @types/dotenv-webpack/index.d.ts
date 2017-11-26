/**
 * dotenv-webpack type definition
 */

declare module 'dotenv-webpack' {
  import { Plugin } from 'webpack'

  type DotWebpackOptions = {
    path?: string,
    safe?: boolean,
    systemvars?: boolean,
    silent?: boolean,
  }

  interface DotWebpackenv {
    new (options?: DotWebpackOptions): Plugin
  }

  // tslint:disable-next-line variable-name
  const Dotenv: DotWebpackenv

  export = Dotenv
}
