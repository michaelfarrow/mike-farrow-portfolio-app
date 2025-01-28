/**
 * This file is used to allow Presentation to set the app in Draft Mode, which will load Visual Editing
 * and query draft content and preview the content as it will appear once everything is published
 */
import { defineEnableDraftMode } from 'next-sanity/draft-mode';

import { STUDIO_API_READ_TOKEN } from '@/lib/env';
import { client } from '@/lib/sanity/client';

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: STUDIO_API_READ_TOKEN }),
});
