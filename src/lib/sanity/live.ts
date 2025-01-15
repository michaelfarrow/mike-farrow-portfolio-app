import { defineLive } from 'next-sanity';
import { client } from '@/lib/sanity/client';
import { STUDIO_API_READ_TOKEN } from '@/lib/env';

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: STUDIO_API_READ_TOKEN,
  serverToken: STUDIO_API_READ_TOKEN,
});
