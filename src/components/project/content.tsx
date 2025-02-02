'use client';

import { createDataAttribute, stegaClean } from 'next-sanity';

import type { getProject } from '@/lib//sanity/queries/project';

import { ContentImage } from '@/components/content/image';
import { ContentPicture } from '@/components/content/picture';
import { ContentVideo } from '@/components/content/video';
import { Array } from '@/components/sanity/array';
import { PortableText } from '@/components/sanity/portable-text';
import { SortableV2, SortableV2Content } from '@/components/sanity/sortable';

export function ProjectContent({
  project,
}: {
  project: NonNullable<Awaited<ReturnType<typeof getProject>>>;
}) {
  if (!project.content) return null;

  return (
    <SortableV2
      document={project}
      path='content'
      getContent={(project) => project.content}
    >
      {(content, props) => (
        // <div>
        //   {content.map((item) => (
        //     <div
        //       key={item._key}
        //       data-sanity={createDataAttribute({
        //         id: project._id,
        //         type: project._type,
        //         path: `content:${item._key}`,
        //       }).toString()}
        //     >
        //       {stegaClean(item._type)}
        //       {(item._type === 'temp' && (
        //         <div
        //           data-sanity={createDataAttribute({
        //             id: project._id,
        //             type: project._type,
        //             path: `content:${item._key}.names`,
        //           }).toString()}
        //         >
        //           {item.names?.map((person) => (
        //             <div
        //               key={person._key}
        //               data-sanity={createDataAttribute({
        //                 id: project._id,
        //                 type: project._type,
        //                 path: `content:${item._key}.names:${person._key}`,
        //               }).toString()}
        //             >
        //               {stegaClean(person.name)}
        //             </div>
        //           )) || null}
        //         </div>
        //       )) ||
        //         null}
        //     </div>
        //   ))}
        // </div>
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
            // responsiveImage: (block) => <ContentPicture image={block} />,
            // image: (block) => <ContentImage image={block} />,
            // video: (block) => <ContentVideo video={block} />,
            temp: (block) => (
              <div>
                {/* <div
                  data-sanity={createDataAttribute({
                    id: project._id,
                    type: project._type,
                    path: `content[_key=="${block._key}".names`,
                  }).toString()}
                >
                  {block.names?.map((person) => (
                    <div
                      key={person._key}
                      data-sanity={createDataAttribute({
                        id: project._id,
                        type: project._type,
                        path: `content[_key=="${block._key}".names[_key=="${person._key}"]`,
                      }).toString()}
                    >
                      {stegaClean(person.name)}
                    </div>
                  ))}
                </div> */}
                {/* <div data-sanity='id=6f4e05d3-42aa-4775-83c5-ba450eaa17c6;type=project;path=content:f90e4d535edd.names;base=%2F'>
                  <div data-sanity='id=6f4e05d3-42aa-4775-83c5-ba450eaa17c6;type=project;path=content:f90e4d535edd.names:73c9172cd432;base=%2F'>
                    "Chandni"
                  </div>
                  <div data-sanity='id=6f4e05d3-42aa-4775-83c5-ba450eaa17c6;type=project;path=content:f90e4d535edd.names:587564ab550c;base=%2F'>
                    "Mike"
                  </div>
                </div> */}
                {/* <SortableV2
                  document={project}
                  path={`content:${block._key}.names`} // Make this a util function from parent
                  getContent={(project) =>
                    project.content
                      ?.filter((item) => 'names' in item)
                      .find((item) => item._key === block._key)?.names
                  }
                >
                  {(names, props) => (
                    <div>
                      {names.map((name) => {
                        const { key, ...rest } = props(name);
                        return (
                          <div key={key} {...rest}>
                            {JSON.stringify(stegaClean(name.name))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </SortableV2> */}

                {(block.names && (
                  <SortableV2Content
                    document={project}
                    path={`content[_key=="${block._key}".names`} // Make this a util function from parent
                    content={block.names}
                  >
                    {(names, props) =>
                      names.map((name) => {
                        const { key, ...rest } = props(name);
                        return (
                          <div key={key} {...rest}>
                            {JSON.stringify(stegaClean(name.name))}
                          </div>
                        );
                      })
                    }
                  </SortableV2Content>
                )) ||
                  null}
                {/* <SortableV2
                  document={project}
                  path={`content[_key=="${block._key}".names`} // Make this a util function from parent
                  getContent={(project) => block.names}
                  child
                >
                  {(names, props) =>
                    names.map((name) => {
                      const { key, ...rest } = props(name);
                      return (
                        <div key={key} {...rest}>
                          {JSON.stringify(stegaClean(name.name))}
                        </div>
                      );
                    })
                  }
                </SortableV2> */}
              </div>
            ),
          }}
        />
      )}
    </SortableV2>
  );
}
