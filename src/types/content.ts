import { PartialDeep } from 'type-fest';

import {
  AllSanitySchemaTypes,
  internalGroqTypeReferenceTo,
} from '@/types/sanity';

export type SchemaTypes = Extract<
  AllSanitySchemaTypes,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { _type: any }
>['_type'];

export type SchemaType<T extends SchemaTypes> = PartialDeep<
  ExpandRefs<Extract<AllSanitySchemaTypes, { _type: T }>>,
  { recurseIntoArrays: true }
>;

export type CommonSchema = SchemaType<'common'>;
export type CommonSchemaType<T extends keyof Omit<CommonSchema, '_type'>> =
  NonNullable<CommonSchema[T]>;

export type ExpandRefs<T> = T extends {
  _type: 'reference';
  [internalGroqTypeReferenceTo]?: infer U extends SchemaTypes;
}
  ? SchemaType<U>
  : T extends object
    ? { [K in keyof T]: ExpandRefs<T[K]> }
    : T;
