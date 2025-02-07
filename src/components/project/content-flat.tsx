'use client';

import clsx from 'clsx';
import { stegaClean } from 'next-sanity';

import type { getProject } from '@/lib//sanity/queries/project';
import { memo } from '@/lib/react';

import { ContentImage } from '@/components/content/image';
import { ContentPicture } from '@/components/content/picture';
import { ContentVideo } from '@/components/content/video';
import { Array, conditionalComponent as cc } from '@/components/sanity/array';
import { PortableText } from '@/components/sanity/portable-text';
import { Sortable, SortableChild } from '@/components/sanity/sortable';

import styles from './content-flat.module.css';

type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>;
type ContentFlatItem = NonNullable<Project['contentFlat']>[number];
type Person = Extract<
  NonNullable<Project['content']>[number],
  { _type: 'temp' }
>;

const TempBlock = memo(
  function ProjectAttribution({
    block,
    SortableChild,
    ...rest
  }: React.ComponentPropsWithoutRef<'div'> & {
    block: Person;
    SortableChild: SortableChild;
  }) {
    return (
      <div {...rest} className={styles.handle}>
        <SortableChild of={block} path='names' items={block.names}>
          {({ items, props }) => (
            <div style={{ display: 'flex' }}>
              {items.map((name) => {
                const { key, ...rest } = props(name);
                return (
                  <div style={{ flex: 1, padding: 30 }} key={key} {...rest}>
                    {stegaClean(name.name)}
                  </div>
                );
              })}
            </div>
          )}
        </SortableChild>
      </div>
    );
  },
  {
    deep: true,
    ignoreFunctions: true,
  }
);

const ProjectContentFlatItem = memo(
  function ProjectContentFlatItem({
    block,
    SortableChild,
    ...rest
  }: React.ComponentPropsWithoutRef<'div'> & {
    block: ContentFlatItem;
    SortableChild: SortableChild;
  }) {
    return (
      <div {...rest} className={styles.handle}>
        <SortableChild of={block} path='content' items={block.content}>
          {({ items, props, SortableChild }) => (
            <Array
              value={items}
              wrapper={(child, children) => {
                const { key, ...rest } = props(child);
                return (
                  <div
                    key={key}
                    className={clsx(child._type === 'temp' && styles.pad)}
                    {...rest}
                  >
                    {children}
                  </div>
                );
              }}
              components={{
                richText: (block) =>
                  cc(
                    block.content?.length,
                    <PortableText value={block.content || []} />
                  ),
                responsiveImage: (block) =>
                  cc(block.main?.asset?.url, <ContentPicture image={block} />),
                image: (block) =>
                  cc(block.asset?.url, <ContentImage image={block} />),
                video: (block) => cc(block.url, <ContentVideo video={block} />),
                temp: (block) =>
                  cc(
                    block.names?.length,
                    <TempBlock block={block} SortableChild={SortableChild} />
                  ),
              }}
            />
          )}
        </SortableChild>
      </div>
    );
  },
  {
    deep: true,
    ignoreFunctions: true,
  }
);

export const ProjectContentFlat = memo(
  function ProjectContentFlat({
    project,
  }: {
    project: NonNullable<Awaited<ReturnType<typeof getProject>>>;
  }) {
    if (!project.content) return null;

    return (
      <Sortable
        document={project}
        path='contentFlat'
        getItems={(project) => project.contentFlat}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}
      >
        {({ items, props, SortableChild }) =>
          items.map((item) => {
            const { key, ...rest } = props(item);
            return (
              <ProjectContentFlatItem
                key={key}
                className={styles.pad}
                style={{
                  gridColumn: item.span === 1 ? undefined : '1 / -1',
                }}
                block={item}
                SortableChild={SortableChild}
                data-sanity-drag-flow='horizontal'
                // data-sanity-drag-flow={
                //   item.span === 1 ? 'vertical' : 'horizontal'
                // }
                {...rest}
              />
            );
          })
        }
      </Sortable>
    );
  },
  { deep: true }
);
