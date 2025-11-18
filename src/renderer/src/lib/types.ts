export type InferElectron<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : T extends Promise<infer R>
    ? R
    : never
