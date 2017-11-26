// /**
//  * Preallocated object pool
//  */
//
// class PooledObject<T> {
//   type PooledGenerator<T> = (...params: any[]) => T
//
//   private isUsed: boolean
//
//   constructor(gen: PooledGenerator<T>) {
//     this.gen = gen
//   }
//
//   public init(...params: any[]): T {
//     this.isUsed = true
//     return this.gen(...params)
//   }
//
//   public release() {
//     this.isUsed = false
//   }
// }
//
// export type ObjectGenerator<ObjectType> = (...args: any[]) => ObjectType
//
// /**
//  * A preallocated object
//  */
// export class Pool<T> {
//   private static EMPTY_SLOT = Object.freeze({})
//
//   private readonly objects: (T | Readonly<{}>)[]
//   private numFree: number
//   private numAllocated: number
//
//   constructor(generatorFn: ObjectGenerator<T>, size: number = 100) {
//     this.objects = []
//     this.objects.fill(Pool.EMPTY_SLOT, 0, size)
//     this.numAllocated = size
//     this.numFree = size
//   }
//
//   get free() {
//     return this.numFree
//   }
//
//   get allocated() {
//     return this.numAllocated
//   }
//
//   // public reserve()
//   // public release(obj: T) {}
// }
