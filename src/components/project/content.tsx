'use client';

import { stegaClean } from 'next-sanity';

import type { getProject } from '@/lib//sanity/queries/project';
import { memo } from '@/lib/react';

import { ContentImage } from '@/components/content/image';
import { ContentPicture } from '@/components/content/picture';
import { ContentVideo } from '@/components/content/video';
import { Array, conditionalComponent as cc } from '@/components/sanity/array';
import { PortableText } from '@/components/sanity/portable-text';
import { Sortable, SortableChild } from '@/components/sanity/sortable';

type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>;
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
      <div {...rest}>
        <SortableChild of={block} path='names' content={block.names}>
          {({ content, props }) => (
            <div style={{ display: 'flex' }}>
              {content.map((name) => {
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
        getContent={(project) => project.content}
      >
        {({ content, props, SortableChild }) => (
          <Array
            value={content}
            wrapper={(block, children) => {
              const { key, ...rest } = props(block);
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
      </Sortable>
    );
  },
  { deep: true }
);
