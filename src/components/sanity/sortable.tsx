'use client';

import { /* isEqual,*/ mapValues } from 'lodash';
import { SanityDocument, createDataAttribute } from 'next-sanity';
import { useOptimistic } from 'next-sanity/hooks';
import { LiteralUnion, Paths } from 'type-fest';

import { ReactNode } from 'react';

import { DisableStega } from '@/context/stega';
import { useIsStudioEmbed } from '@/hooks/sanity';

type ContentItem = {
  _key: string;
};

type PageData = {
  _id: string;
  _type: string;
};

export type SortableChildren<
  T extends PageData,
  P extends LiteralUnion<Paths<T>, string>,
  C extends ContentItem,
> = (data: {
  content: C[];
  props: (item: C) => {
    key: string;
    'data-sanity': string | undefined;
    [key: `data-sanity-${string}`]: string | undefined;
  };
  SortableChild: ReturnType<typeof createSortableChild<T, P>>;
}) => ReactNode;

function createSortableChild<
  T extends PageData,
  P extends LiteralUnion<Paths<T>, string>,
>({ document, path, group }: { document: T; path: P; group?: string }) {
  function SortableChild<C extends ContentItem>({
    of,
    path: childPath,
    content,
    children,
  }: {
    of: ContentItem;
    path: string;
    content: C[] | undefined;
    children: SortableChildren<T, P, C>;
  }) {
    if (!content) return null;
    return (
      <SortableContent
        document={document}
        path={`${path}:${of._key}.${childPath}`}
        content={content}
        group={group}
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
  content,
  path,
  children,
  group,
}: {
  document: T;
  path: P;
  content: C[];
  children: SortableChildren<T, P, C>;
  group?: string;
}) {
  const isStudioEmbed = useIsStudioEmbed();

  const { _id: id, _type: type } = document;

  return (
    <div
      data-sanity={
        isStudioEmbed
          ? createDataAttribute({
              id,
              type,
              path,
            }).toString()
          : undefined
      }
    >
      {children({
        content,
        props: (item) => {
          return {
            key: item._key,
            'data-sanity-drag-group': group,
            'data-sanity': isStudioEmbed
              ? createDataAttribute({
                  id,
                  type,
                  path: `${path}:${item._key}`,
                }).toString()
              : undefined,
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
  FetchContent extends (document: T) => C[] | undefined,
  C extends ContentItem = FetchContent extends (
    document: T
  ) => (infer X extends ContentItem)[] | undefined
    ? X
    : ContentItem,
>({
  document,
  path,
  getContent,
  children,
  group,
}: {
  document: T;
  path: P;
  getContent: FetchContent;
  children: SortableChildren<T, P, C>;
  group?: string;
}) {
  const initialContent = getContent(document);

  const content = useOptimistic<C[], SanityDocument<T>>(
    initialContent || [],
    (content, action) => {
      const newContent = getContent(action.document);
      if (
        action.id === document._id &&
        newContent /* &&
        isEqual(getKeys(content), getKeys(newContent)) */
      ) {
        console.log('mutation', path, action, getContent);

        try {
          const restored = restoreRefs(newContent, content);
          console.log('mutation', newContent, content, restored);
          return restored;
        } catch (e) {
          console.error(e);
          return content;
        }
      } else {
        console.log('mutation JERE');
      }
      return content;
    }
  );

  if (!content?.length) {
    return null;
  }

  return (
    <DisableStega>
      <SortableContent
        group={group}
        document={document}
        content={content}
        path={path}
      >
        {children}
      </SortableContent>
    </DisableStega>
  );
}
