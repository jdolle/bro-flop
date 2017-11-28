/**
 * uglify-webpack-plugin type definition
 */

declare module 'uglifyjs-webpack-plugin' {
  import { Plugin } from 'webpack'

  type ExtractCommentsFn = (node: string, extractComments: string | RegExp) => boolean | {}
  type WarningsFilterFn = (source?: string) => boolean

  type OutputOptions = {
    ascii_only?: boolean,
    beautify?: boolean,
    bracketize?: boolean,
    comments?: boolean,
    ecma?: number,
    indent_level?: number,
    indent_start?: number,
    inline_script?: boolean,
    keep_quoted_props?: boolean,
    max_line_len?: boolean,
    preamble?: string | null,
    preserve_line?: boolean,
    quote_keys?: boolean,
    quote_style?: 0 | 1 | 2 | 3,
    semicolons?: boolean,
    shebang?: boolean,
    width?: number,
    wrap_iife?: boolean,
  }

  type MangleProperties = {}

  type UglifyOptions = {
    ie8?: boolean,
    ecma?: number,
    parse?: {},
    mangle?: boolean | MangleProperties,
    output?: OutputOptions,
    compress?: boolean,
    warnings?: boolean,
  }

  type UglifyJSPluginOptions = {
    test?: RegExp | RegExp[],
    include?: RegExp | RegExp[],
    exclude?: RegExp | RegExp[],
    cache?: boolean | string,
    parallel?: boolean | number,
    sourceMap?: boolean,
    uglifyOptions?: UglifyOptions,
    extractComments?: boolean | RegExp | ExtractCommentsFn | {},
    warningsFilter?: WarningsFilterFn,
  }

  interface IUglifyJSPlugin {
    new (options?: UglifyJSPluginOptions): Plugin
  }

  // tslint:disable-next-line variable-name
  const UglifyJSPlugin: IUglifyJSPlugin

  export = UglifyJSPlugin
}
