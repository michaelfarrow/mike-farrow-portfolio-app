import { Get, Paths } from 'type-fest';

export type KeysMatching<T extends object, V> = {
  [K in keyof T]-?: T[K] extends never ? never : T[K] extends V ? K : never;
}[keyof T];

export type KeysMatchingDeep<T, V> = KeysMatching<
  {
    [K in Paths<T>]: K extends undefined
      ? never
      : K extends string
        ? Get<T, K>
        : never;
  },
  V
>;
