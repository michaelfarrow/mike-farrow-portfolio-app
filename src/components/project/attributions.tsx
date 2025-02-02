'use client';

import { stegaClean } from 'next-sanity';

// import { useStegaValue } from '@/hooks/stega';
import type { getProject } from '@/lib//sanity/queries/project';

import { Sortable } from '@/components/sanity/sortable';

type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>;
// type Attribution = NonNullable<Project['attributions']>[number];

// function ProjectAttribution({ attribution }: { attribution: Attribution }) {
//   const _attribution = useStegaValue(attribution);
//   return (
//     <div>
//       <h3>{_attribution.name}</h3>
//       <ul>
//         {_attribution.contacts?.map((contact) => (
//           <li key={contact._id}>{contact.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

export function ProjectAttributions({ project }: { project: Project }) {
  return (
    <Sortable
      document={project}
      path='attributions'
      getContent={(project) => project.attributions}
    >
      {({ content, props, SortableChild }) => (
        <div>
          {content.map((attr) => {
            const { key, ...rest } = props(attr);
            return (
              <div key={key} {...rest}>
                <div>
                  <h3>{stegaClean(attr.name)}</h3>
                  <ul>
                    <SortableChild
                      of={attr}
                      path={`contacts`} // Make this a util function from parent
                      content={attr.contacts}
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
              </div>
            );
          })}
        </div>
      )}
    </Sortable>
  );
}
