'use client';

import type { getProject } from '@/lib//sanity/queries/project';
import { useStegaValue } from '@/lib/stega';

import { Sortable } from '@/components/sanity/sortable';

type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>;
type Attribution = NonNullable<Project['attributions']>[number];

function ProjectAttribution({ attribution }: { attribution: Attribution }) {
  const _attribution = useStegaValue(attribution);
  return (
    <div>
      <h3>{_attribution.name}</h3>
      <ul>
        {_attribution.contacts?.map((contact) => (
          <li key={contact._id}>{contact.name}</li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectAttributions({ project }: { project: Project }) {
  return (
    <Sortable document={project} path='attributions'>
      {(content, props) => (
        <div>
          {content.map((attr) => {
            const { key, ...rest } = props(attr);
            return (
              <div key={key} {...rest}>
                <ProjectAttribution attribution={attr} />
              </div>
            );
          })}
        </div>
      )}
    </Sortable>
  );
}
