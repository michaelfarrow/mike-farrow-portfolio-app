'use client';

import { SanityDocument, createDataAttribute } from 'next-sanity';
import { useOptimistic } from 'next-sanity/hooks';
import { LiteralUnion, Paths } from 'type-fest';

import { ReactNode } from 'react';

import { useIsStudioEmbed } from '@/hooks/sanity';

import { Stega } from '@/context/stega';

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
  };
  SortableChild: ReturnType<typeof createSortableChild<T, P>>;
}) => ReactNode;

function createSortableChild<
  T extends PageData,
  P extends LiteralUnion<Paths<T>, string>,
>(document: T, path: P) {
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
      >
        {children}
      </SortableContent>
    );
  }
  return SortableChild;
}

export function SortableContent<
  T extends PageData,
  P extends LiteralUnion<Paths<T>, string>,
  C extends ContentItem,
>({
  document,
  content,
  path,
  children,
}: {
  document: T;
  path: P;
  content: C[];
  children: SortableChildren<T, P, C>;
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
            'data-sanity': isStudioEmbed
              ? createDataAttribute({
                  id,
                  type,
                  path: `${path}:${item._key}`,
                }).toString()
              : undefined,
          };
        },
        SortableChild: createSortableChild(document, path),
      })}
    </div>
  );
}

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
}: {
  document: T;
  path: P;
  getContent: FetchContent;
  children: SortableChildren<T, P, C>;
}) {
  const isStudioEmbed = useIsStudioEmbed();
  const initialContent = getContent(document);

  const content = useOptimistic<C[], SanityDocument<T>>(
    initialContent || [],
    (content, action) => {
      console.log(action);
      const newContent = getContent(action.document);
      if (action.id === document._id && newContent) {
        console.log('here');
        return newContent;
        // TODO: Restore refs properly
        // TODO: support primative arrays
        // return newContent.map(
        //   (item) => content?.find((s) => s._key === item?._key) ?? item
        // );
      }
      return content;
    }
  );

  if (!content?.length) {
    return null;
  }

  return (
    <Stega enabled={!isStudioEmbed}>
      <SortableContent document={document} content={content} path={path}>
        {children}
      </SortableContent>
    </Stega>
  );
}
