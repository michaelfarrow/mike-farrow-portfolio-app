'use client';

import { stegaClean } from 'next-sanity';

import { useStegaValue } from '@/hooks/stega';
import type { getProject } from '@/lib//sanity/queries/project';

import { SortableV2, SortableV2Content } from '@/components/sanity/sortable';

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
    <SortableV2
      document={project}
      path='attributions'
      getContent={(project) => project.attributions}
    >
      {(content, props) => (
        <div>
          {content.map((attr) => {
            const { key, ...rest } = props(attr);
            return (
              <div key={key} {...rest}>
                <div>
                  <h3>{attr.name}</h3>
                  <ul>
                    {/* Make this a prop from parent */}
                    {(attr.contacts && (
                      <SortableV2Content
                        document={project}
                        path={`attributions:${attr._key}.contacts`} // Make this a util function from parent
                        content={attr.contacts}
                      >
                        {(content, props) => {
                          return content.map((contact) => {
                            const { key, ...rest } = props(contact);
                            return (
                              <li key={key} {...rest}>
                                {stegaClean(contact.name)}
                              </li>
                            );
                          });
                        }}
                      </SortableV2Content>
                    )) ||
                      null}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SortableV2>
  );
}
