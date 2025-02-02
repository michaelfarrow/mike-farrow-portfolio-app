'use client';

import { stegaClean } from 'next-sanity';

import type { getProject } from '@/lib//sanity/queries/project';

import { ContentImage } from '@/components/content/image';
import { ContentPicture } from '@/components/content/picture';
import { ContentVideo } from '@/components/content/video';
import { Array } from '@/components/sanity/array';
import { PortableText } from '@/components/sanity/portable-text';
import { Sortable } from '@/components/sanity/sortable';

export function ProjectContent({
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
              block.content && <PortableText value={block.content || null} />,
            responsiveImage: (block) => <ContentPicture image={block} />,
            image: (block) => <ContentImage image={block} />,
            video: (block) => <ContentVideo video={block} />,
            temp: (block) => (
              <div>
                {(block.names && (
                  <SortableChild of={block} path='names' content={block.names}>
                    {({ content, props }) =>
                      content.map((name) => {
                        const { key, ...rest } = props(name);
                        return (
                          <div key={key} {...rest}>
                            {JSON.stringify(stegaClean(name.name))}
                          </div>
                        );
                      })
                    }
                  </SortableChild>
                )) ||
                  null}
              </div>
            ),
          }}
        />
      )}
    </Sortable>
  );
}
