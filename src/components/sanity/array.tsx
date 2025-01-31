import type { ComponentType, ReactNode } from 'react';
import React, { Fragment } from 'react';

export type ArrayItem = {
  _key: string;
  _type: string;
};

export interface ArrayProps<T extends ArrayItem> {
  value: T[];
  components?: {
    [K in T['_type']]?: ComponentType<{
      value: Extract<T, { _type: K }>;
    }>;
  };
  wrapper: (item: ArrayItem, children: ReactNode) => ReactNode;
}

export function Array<T extends ArrayItem>({
  value,
  components = {},
  wrapper = (_block, children) => children,
}: ArrayProps<T>) {
  const _components: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComponentType<{ value: any }> | undefined
  > = components;

  return (
    <>
      {value.map((item) => {
        const C = _components[item._type];
        return (
          <Fragment key={item._key}>
            {(C && wrapper(item, <C value={item} />)) || null}
          </Fragment>
        );
      })}
    </>
  );
}
