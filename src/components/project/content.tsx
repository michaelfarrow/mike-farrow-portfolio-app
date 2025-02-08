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
import { Sortable, SortableChild } from '@/components/sanity/sortable';

import styles from './content.module.css';

type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>;
type Content = NonNullable<Project['content']>;
type ContentItem = Content[number];

const ProjectContentItem = memo(
  function ProjectContentItem({
    block,
    SortableChild,
    className,
    ...rest
  }: React.ComponentPropsWithoutRef<'div'> & {
    block: ContentItem;
    SortableChild: SortableChild;
  }) {
    return (
      <div {...rest} className={clsx(className, styles.handle)}>
        <SortableChild of={block} path='content' items={block.content}>
          {({ items, props }) => (
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
                md: (block) =>
                  cc(block.content?.length, <Markdown value={block.content} />),
                responsiveImage: (block) =>
                  cc(block.main?.asset?.url, <ContentPicture image={block} />),
                image: (block) =>
                  cc(block.asset?.url, <ContentImage image={block} />),
                video: (block) => cc(block.url, <ContentVideo video={block} />),
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

export const ProjectContent = memo(
  function ProjectContent({
    project,
  }: {
    project: NonNullable<Awaited<ReturnType<typeof getProject>>>;
  }) {
    if (!project.content) return null;

    return (
      <Sortable
        document={project}
        path='content'
        getItems={(project) => project.content}
        className={styles.grid}
      >
        {({ items, props, SortableChild }) =>
          items.map((item) => {
            const { key, ...rest } = props(item);
            return (
              <ProjectContentItem
                key={key}
                className={clsx(
                  styles.gridItem,
                  stegaClean(item.span) === 'full' && styles.gridItemFull
                )}
                block={item}
                SortableChild={SortableChild}
                data-sanity-drag-flow='horizontal'
                // data-sanity-drag-flow={
                //   stegaClean(item.span) === 'full ? 'horizontal' : 'vertical'
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
