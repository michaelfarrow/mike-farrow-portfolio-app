/* eslint-disable  @typescript-eslint/no-explicit-any */

import { map, mapValues } from 'lodash';
import { sanityFetch } from '@/lib/sanity/live';
import { type PartialOnUndefinedDeep, type ArrayValues } from 'type-fest';

export type Query = Parameters<typeof sanityFetch>[0]['query'];
export type Params = Parameters<typeof sanityFetch>[0]['params'];

export type NullToUndefined<T extends object | object[]> = T extends object[]
  ? NullToUndefined<ArrayValues<T>>[]
  : PartialOnUndefinedDeep<{
      [Prop in keyof T]: null extends T[Prop]
        ?
            | (NonNullable<T[Prop]> extends object | object[]
                ? NullToUndefined<NonNullable<T[Prop]>>
                : NonNullable<T[Prop]>)
            | undefined
        : T[Prop] extends object | object[]
          ? NullToUndefined<T[Prop]>
          : T[Prop];

      // [Prop in keyof T]:
      //   | (NonNullable<T[Prop]> extends object | object[]
      //       ? NullToUndefined<NonNullable<T[Prop]>>
      //       : NonNullable<T[Prop]>)
      //   | (null extends T[Prop] ? undefined : null);

      // [Prop in keyof T]: NonNullable<T[Prop]> extends object | object[]
      //   ? null extends T[Prop]
      //     ? NullToUndefined<NonNullable<T[Prop]>> | undefined
      //     : NullToUndefined<NonNullable<T[Prop]>>
      //   : null extends T[Prop]
      //     ? NonNullable<T[Prop]> | undefined
      //     : NonNullable<T[Prop]>;
    }>;

function nullToUndefined<T extends object | object[]>(
  o: T
): NullToUndefined<T> {
  return ((Array.isArray(o) ? map : mapValues) as any)(o, (v: any) => {
    if (v === null) return undefined;
    if (typeof v === 'object') return nullToUndefined(v);
    return v;
  });
}

export async function fetch<T extends Query>(query: T, params?: Params) {
  const res = await sanityFetch({ query, params });
  return nullToUndefined(res);
}

export function createQuery<T extends Query>(query: T) {
  const rawFetch = () => fetch<T>(query);

  rawFetch.withParams = <P extends Params>(params: P) =>
    fetch<T>(query, params);

  return rawFetch;
}
