// import { remove } from 'lodash'
import { BaseComponent } from './Components/BaseComponent'
import { Entity } from './Entity'
import { EntitySignatures } from './EntitySignatures'

/**
 * Some components. TODO: implement recycling/pooling
 */
export class ComponentList<CT extends BaseComponent> {
  private components: (CT | undefined)[] = []
  private entitySignatures: EntitySignatures

  constructor(entitySignatures: EntitySignatures) {
    this.entitySignatures = entitySignatures
  }

  public find(entity: Entity) {
    return this.components[entity]
  }

  public add(entity: Entity, component: CT) {
    this.components[entity] = component
    // NOTE: not real type safety... Feels bad.
    this.entitySignatures.add(entity, (component.constructor as typeof BaseComponent).typeEnum)
  }

  public remove(entity: Entity): CT | undefined {
    const component = this.components[entity]
    if (component !== undefined) {
      // NOTE: not real type safety... Feels bad.
      this.entitySignatures.remove(entity, (component.constructor as typeof BaseComponent).typeEnum)
      this.components[entity] = undefined
    }

    return component
  }

  public clear(entity?: Entity) {
    if (entity === undefined) {
      this.components = []
    } else {
      this.components[entity] = undefined
    }
  }
}
