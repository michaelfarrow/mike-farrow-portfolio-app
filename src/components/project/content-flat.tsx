'use client';

import clsx from 'clsx';
import { stegaClean } from 'next-sanity';

import { getProject } from '@/lib//sanity/queries/project';
import { memo } from '@/lib/react';

import { ContentImage } from '@/components/content/image';
import { Markdown } from '@/components/content/markdown';
import { ContentPicture } from '@/components/content/picture';
import { ContentVideo } from '@/components/content/video';
import { Array, conditionalComponent as cc } from '@/components/sanity/array';
import { PortableText } from '@/components/sanity/portable-text';
import { Sortable, SortableChild } from '@/components/sanity/sortable';

import styles from './content-flat.module.css';

type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>;
type ContentFlatItem = NonNullable<Project['contentFlat']>[number];
type Person = Extract<
  NonNullable<NonNullable<Project['contentFlat']>[number]['content']>[number],
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
    className,
    ...rest
  }: React.ComponentPropsWithoutRef<'div'> & {
    block: ContentFlatItem;
    SortableChild: SortableChild;
  }) {
    return (
      <div {...rest} className={clsx(className, styles.handle)}>
        <SortableChild of={block} path='content' items={block.content}>
          {({ items, props, SortableChild }) => (
            <Array
              value={items}
              wrapper={(child, children) => {
                const { key, ...rest } = props(child);
                return (
                  <div key={key} {...rest}>
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
                md: (block) =>
                  cc(block.content?.length, <Markdown value={block.content} />),
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
    if (!project.contentFlat) return null;

    return (
      <Sortable
        document={project}
        path='contentFlat'
        getItems={(project) => project.contentFlat}
        className={styles.grid}
      >
        {({ items, props, SortableChild }) =>
          items.map((item) => {
            const { key, ...rest } = props(item);
            return (
              <ProjectContentFlatItem
                key={key}
                className={clsx(
                  styles.gridItem,
                  item.span === 2 && styles.gridItemFull
                )}
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
