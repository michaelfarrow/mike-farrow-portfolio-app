import Link from 'next/link';

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
          {albums.map((album) => (
            <li key={album._id}>
              <Link href={`/albums/${album?.slug?.current}`}>{album.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  },
});

export const { generateMetadata } = albums;
export default albums.page;
