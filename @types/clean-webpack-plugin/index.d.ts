/**
 * clean-webpack-plugin type definition
 */

declare module 'clean-webpack-plugin' {
  import { Plugin } from 'webpack'

  type CleanWebpackPluginOptions = {
    root?: string,
    verbose?: boolean,
    dry?: boolean,
    watch?: boolean,
    exclude?: string[],
    allowExternal?: boolean,
  }

  interface ICleanWebpackPlugin {
    new (paths: string[], options?: CleanWebpackPluginOptions): Plugin
  }

  // tslint:disable-next-line variable-name
  const CleanWebpackPlugin: ICleanWebpackPlugin

  export = CleanWebpackPlugin
}
