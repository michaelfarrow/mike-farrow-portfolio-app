import { defineLive } from 'next-sanity';

import { STUDIO_API_READ_TOKEN } from '@/lib/env';
import { client } from '@/lib/sanity/client';

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: STUDIO_API_READ_TOKEN,
  serverToken: STUDIO_API_READ_TOKEN,
  fetchOptions: {
    revalidate: 60,
  },
});
