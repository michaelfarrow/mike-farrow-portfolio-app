'use client';

import { /* isEqual,*/ mapValues } from 'lodash';
import { SanityDocument, createDataAttribute } from 'next-sanity';
import { useOptimistic } from 'next-sanity/hooks';
import { LiteralUnion, Paths } from 'type-fest';

import { ReactNode } from 'react';

import { DisableStega } from '@/context/stega';
import { STUDIO_BASE_URL, STUDIO_CONFIG } from '@/lib/env.client';

type ContentItem = {
  _key: string;
};

type PageData = {
  _id: string;
  _type: string;
};

export type SortableProps = (item: ContentItem) => {
  key: string;
  'data-sanity': string | undefined;
  [key: `data-sanity-${string}`]: string | undefined;
};

export type SortableChildren<
  T extends PageData,
  P extends LiteralUnion<Paths<T>, string>,
  C extends ContentItem,
> = (data: {
  items: C[];
  props: SortableProps;
  SortableChild: ReturnType<typeof createSortableChild<T, P>>;
}) => ReactNode;

function createSortableChild<
  T extends PageData,
  P extends LiteralUnion<Paths<T>, string>,
>({ document, path, group }: { document: T; path: P; group?: string }) {
  function SortableChild<C extends ContentItem>({
    of,
    path: childPath,
    items,
    children,
    disable,
  }: {
    of: ContentItem;
    path: string;
    items: C[] | undefined;
    children: SortableChildren<T, P, C>;
    disable?: boolean;
  }) {
    if (!items) return null;
    return (
      <SortableContent
        document={document}
        path={`${path}:${of._key}.${childPath}`}
        items={items}
        group={group}
        disable={disable}
      >
        {children}
      </SortableContent>
    );
  }
  return SortableChild;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SortableChild = ReturnType<typeof createSortableChild<any, any>>;

export function SortableContent<
  T extends PageData,
  P extends LiteralUnion<Paths<T>, string>,
  C extends ContentItem,
>({
  document,
  items,
  path,
  children,
  group,
  disable,
  ...rest
}: Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  document: T;
  path: P;
  items: C[];
  children: SortableChildren<T, P, C>;
  group?: string;
  disable?: boolean;
}) {
  const { _id: id, _type: type } = document;

  return (
    <div
      {...rest}
      data-sanity={
        disable
          ? undefined
          : createDataAttribute({
              ...STUDIO_CONFIG,
              baseUrl: STUDIO_BASE_URL,
              id,
              type,
              path,
            }).toString()
      }
    >
      {children({
        items,
        props: (item) => {
          return {
            key: item._key,
            'data-sanity-drag-group': group,
            'data-sanity': disable
              ? undefined
              : createDataAttribute({
                  ...STUDIO_CONFIG,
                  baseUrl: STUDIO_BASE_URL,
                  id,
                  type,
                  path: `${path}:${item._key}`,
                }).toString(),
          };
        },
        SortableChild: createSortableChild({ document, path, group }),
      })}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function restoreRefs(o: any, existing: any) {
  if (Array.isArray(o))
    return o.map((val, i): any => {
      const exisingVal =
        (val &&
          val._key &&
          existing?.find((s: any) => s?._key === val?._key)) ||
        existing?.[i];
      return exisingVal ? restoreRefs(val, exisingVal) : val;
    });

  if (typeof o === 'object') {
    if (o._type === 'reference') {
      return existing;
    }
    return mapValues(o, (val, key): any => {
      const exisingVal = existing?.[key];
      return exisingVal ? restoreRefs(val, existing?.[key]) : val;
    });
  }

  return o;
}

/* eslint-enable @typescript-eslint/no-explicit-any */
// function getKeys(content: (ContentItem | undefined)[] | undefined) {
//   return (content || []).map((item) => item?._key).sort();
// }

export function Sortable<
  T extends PageData,
  P extends LiteralUnion<Paths<T>, string>,
  FetchItems extends (document: T) => C[] | undefined,
  C extends ContentItem = FetchItems extends (
    document: T
  ) => (infer X extends ContentItem)[] | undefined
    ? X
    : ContentItem,
>({
  document,
  path,
  getItems,
  children,
  group,
  disable,
  ...rest
}: Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  document: T;
  path: P;
  getItems: FetchItems;
  children: SortableChildren<T, P, C>;
  group?: string;
  disable?: boolean;
}) {
  const initialItems = getItems(document);

  const items = useOptimistic<C[], SanityDocument<T>>(
    initialItems || [],
    (_items, action) => {
      const items = initialItems;
      const newContent = getItems(action.document);
      if (
        action.id === document._id &&
        newContent /* &&
        isEqual(getKeys(items), getKeys(newContent)) */
      ) {
        console.log('mutation', path, action, getItems);

        try {
          const restored = restoreRefs(newContent, items);
          console.log('mutation', newContent, items, restored);
          return restored;
        } catch (e) {
          console.error(e);
          return items;
        }
      } else {
        console.log('mutation JERE');
      }
      return items;
    }
  );

  if (!items?.length) {
    return null;
  }

  return (
    <DisableStega>
      <SortableContent
        {...rest}
        group={group}
        document={document}
        items={items}
        path={path}
        disable={disable}
      >
        {children}
      </SortableContent>
    </DisableStega>
  );
}
