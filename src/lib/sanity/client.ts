import { createClient } from '@sanity/client';
import { STUDIO_BASE_URL, STUDIO_CONFIG } from '@/lib/env';

export const client = createClient({
  ...STUDIO_CONFIG,
  useCdn: false,
  stega: { studioUrl: STUDIO_BASE_URL },
});
