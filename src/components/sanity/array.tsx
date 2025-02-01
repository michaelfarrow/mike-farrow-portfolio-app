import type { ReactNode } from 'react';
import React, { Fragment } from 'react';

export type ArrayItem = {
  _key: string;
  _type: string;
};

type ComponentRenderer<T> = (block: T) => ReactNode;

export interface ArrayProps<T extends ArrayItem> {
  value: T[];
  components?: {
    [K in T['_type']]?: ComponentRenderer<Extract<T, { _type: K }>>;
  };
  wrapper: (item: ArrayItem, children: ReactNode) => ReactNode;
}

export function Array<T extends ArrayItem>({
  value,
  components = {},
  wrapper = (_block, children) => children,
}: ArrayProps<T>) {
  const _components: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: ComponentRenderer<any> | undefined;
  } = components;

  return (
    <>
      {value.map((item) => {
        const component = _components[item._type];
        const rendered = component && component(item);
        return rendered ? (
          <Fragment key={item._key}>{wrapper(item, rendered)}</Fragment>
        ) : null;
      })}
    </>
  );
}
