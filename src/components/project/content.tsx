'use client';

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
    <Sortable document={project} path='content'>
      {(content, props) => (
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
              block.value.content && (
                <PortableText value={block.value.content || null} />
              ),
            responsiveImage: (block) => <ContentPicture image={block.value} />,
            image: (block) => <ContentImage image={block.value} />,
            video: (block) => <ContentVideo video={block.value} />,
          }}
        />
      )}
    </Sortable>
  );
}
