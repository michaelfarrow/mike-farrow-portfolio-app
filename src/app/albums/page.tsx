import Link from 'next/link';

import { albumHref } from '@/lib/link';
import { createPage } from '@/lib/page';
import { getAlbums } from '@/lib/sanity/queries/album';

const albums = createPage('albums', getAlbums, {
  metadata: () => ({
    title: 'Albums',
  }),
  render: (albums) => {
    return (
      <div>
        <ul>
          {albums.map((album) => {
            if (!album.slug?.current) return null;
            return (
              <li key={album._id}>
                <Link href={albumHref({ slug: album.slug.current })}>
                  {album.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
});

export const { generateMetadata } = albums;
export default albums.page;
