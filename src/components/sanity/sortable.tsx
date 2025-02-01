'use client';

import { SanityDocument, createDataAttribute } from 'next-sanity';
import { useOptimistic } from 'next-sanity/hooks';
import { Get, Paths } from 'type-fest';

import { ReactNode } from 'react';

import { KeysMatching } from '@/types/utils';

import { Stega } from '@/context/stega';
import { useIsStudioEmbed } from '@/hooks/sanity';
import { get } from '@/lib/object';

const contentItemKeys = ['_key'] as const; // , '_type'
type ContentItemKeys = (typeof contentItemKeys)[number];

type ContentItem = {
  [key in ContentItemKeys]: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isContentItem<C extends ContentItem>(o: any): o is C {
  return (
    typeof o === 'object' &&
    contentItemKeys.filter((key) => !(key in o)).length === 0
  );
}

type PageData = {
  _id: string;
  _type: string;
};

export function Sortable<
  T extends PageData,
  P extends KeysMatching<
    {
      [K in Paths<T>]: NonNullable<Get<T, K>>;
    },
    ContentItem[]
  >,
  C extends NonNullable<Get<T, P>> extends (infer X extends ContentItem)[]
    ? X
    : ContentItem,
>({
  document,
  path,
  children,
}: {
  document: T;
  path: P;
  children: (
    content: NonNullable<C[]>,
    props: (item: ContentItem) => {
      key: string;
      'data-sanity': string | undefined;
    }
  ) => ReactNode;
}) {
  const isStudioEmbed = useIsStudioEmbed();

  const { _id: documentId, _type: documentType } = document;

  const getContent = (document: T): C[] => {
    const content = get(document, path);
    return Array.isArray(content) &&
      content
        .map((item) => (isContentItem<C>(item) ? item : null))
        .filter((item) => item !== null).length
      ? content
      : [];
  };

  const initialContent = getContent(document);

  const content = useOptimistic<C[], SanityDocument<T>>(
    initialContent,
    (content, action) => {
      const newContent = getContent(action.document);
      if (action.id === documentId && newContent) {
        return newContent.map(
          (item) => content?.find((s) => s._key === item?._key) ?? item
        );
      }
      return content;
    }
  );

  if (!content?.length) {
    return null;
  }

  return (
    <Stega enabled={!isStudioEmbed}>
      <div
        data-sanity={
          isStudioEmbed
            ? createDataAttribute({
                id: documentId,
                type: documentType,
                path,
              }).toString()
            : undefined
        }
      >
        {children(content, (section: ContentItem) => {
          return {
            key: section._key,
            'data-sanity': isStudioEmbed
              ? createDataAttribute({
                  id: documentId,
                  type: documentType,
                  path: `${path}[_key=="${section._key}"]`,
                }).toString()
              : undefined,
          };
        })}
      </div>
    </Stega>
  );
}
