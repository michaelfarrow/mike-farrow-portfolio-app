import { getExifData } from '@/lib/image';
import { createPage } from '@/lib/page';
import { getAlbum, getAlbums } from '@/lib/sanity/queries/album';

import { ContentImage } from '@/components/content/image';

const album = createPage('album', getAlbum, {
  metadata: ({ name }) => ({
    title: name,
  }),
  params: async () => {
    const { data: albums } = await getAlbums();
    return albums
      .map(({ slug }) => slug?.current)
      .filter((slug) => slug !== undefined)
      .map((slug) => ({ slug }));
  },
  render: ({ name, photos }) => {
    return (
      <div style={{ maxWidth: 1500, margin: 'auto' }}>
        <h1>{name}</h1>
        <ul>
          {photos?.map((photo) => {
            const exif = getExifData(photo);
            const settings =
              exif?.settings && Object.values(exif.settings).filter((v) => !!v);

            return (
              <li key={photo._key}>
                <ContentImage image={photo} />
                {null}
                {(settings && <div>{settings.join(', ')}</div>) || undefined}
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
});

export const { generateMetadata, generateStaticParams } = album;
export default album.page;
