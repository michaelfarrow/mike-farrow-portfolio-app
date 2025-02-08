import Link from 'next/link';

import { getExifData } from '@/lib/image';
import { createPage } from '@/lib/page';
import { getProject } from '@/lib/sanity/queries/project';

import { Markdown } from '@/components/content/markdown';
import { Figure } from '@/components/general/figure';
import { ProjectAttributions } from '@/components/project/attributions';
import { ProjectContent } from '@/components/project/content';
import { SanityImage } from '@/components/sanity/image';

const project = createPage('project', getProject, {
  metadata: ({ name, hideFromSearchEngines, private: isPrivate }) => ({
    title: name,
    robots: hideFromSearchEngines || isPrivate ? { index: false } : undefined,
  }),
  render: (project) => {
    const { name, description, descriptionLong, thumbnail } = project;

    const exif = thumbnail ? getExifData(thumbnail) : null;
    const settings =
      exif?.settings && Object.values(exif.settings).filter((v) => !!v);

    return (
      <div style={{ maxWidth: 1500, margin: 'auto' }}>
        <div>
          <Link href='/'>← Back to projects</Link>
        </div>
        <div>{name ? <h1>{name}</h1> : null}</div>
        <div>{description ? <p>{description}</p> : null}</div>
        <div>
          {descriptionLong ? <Markdown value={descriptionLong} /> : null}
        </div>
        {thumbnail ? (
          <Figure
            caption={
              (exif && (
                <>
                  {exif.camera && <div>{exif.camera}</div>}
                  {exif.lens && <div>{exif.lens}</div>}
                  {(settings && <div>{settings.join(' ')}</div>) || null}
                </>
              )) ||
              null
            }
          >
            <SanityImage
              image={thumbnail}
              sizes='(max-width: 800px) 100vw, 800px'
              style={{ width: '100%', maxWidth: 800, height: 'auto' }}
            />
          </Figure>
        ) : null}
        <ProjectContent project={project} />
        <ProjectAttributions project={project} />
      </div>
    );
  },
});

export const { generateMetadata } = project;
export default project.page;
