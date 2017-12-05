import { ComponentType } from './ComponentType'

/**
 * Provide a basic interface for components
 */
export abstract class BaseComponent {
  // readonly typeEnum: ComponentType
  public static readonly typeEnum: ComponentType
  public readonly state: { readonly [key: string]: any }
}
