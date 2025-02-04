'use client';

import { stegaClean } from 'next-sanity';

import { useStegaValue } from '@/hooks/stega';
// import { useStegaValue } from '@/hooks/stega';
import type { getProject } from '@/lib//sanity/queries/project';
import { memo } from '@/lib/react';

import { Sortable, SortableChild } from '@/components/sanity/sortable';

type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>;
type Attribution = NonNullable<Project['attributions']>[number];

const ProjectAttribution = memo(
  function ProjectAttribution({
    attribution,
    SortableChild,
    ...rest
  }: React.ComponentPropsWithoutRef<'div'> & {
    attribution: Attribution;
    SortableChild: SortableChild;
  }) {
    const _attribution = useStegaValue(attribution);
    return (
      <div {...rest}>
        <h3>{_attribution.name}</h3>
        <ul>
          <SortableChild
            of={_attribution}
            path='contacts'
            content={_attribution.contacts}
          >
            {({ content, props }) => {
              return content.map((contact) => {
                const { key, ...rest } = props(contact);
                return (
                  <li key={key} {...rest}>
                    {stegaClean(contact.name)}
                  </li>
                );
              });
            }}
          </SortableChild>
        </ul>
      </div>
    );
  },
  {
    deep: true,
    ignoreFunctions: true,
  }
);

export const ProjectAttributions = memo(
  function ProjectAttributions({ project }: { project: Project }) {
    return (
      <Sortable
        document={project}
        path='attributions'
        getContent={(project) => project.attributions}
      >
        {({ content, props, SortableChild }) =>
          content.map((attr) => {
            const { key, ...rest } = props(attr);
            return (
              <ProjectAttribution
                key={key}
                attribution={attr}
                SortableChild={SortableChild}
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
