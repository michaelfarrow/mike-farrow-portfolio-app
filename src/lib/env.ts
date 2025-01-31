import { STUDIO_CONFIG as STUDIO_CONFIG_CLIENT } from '@/lib/env.client';

export * from './env.client';

if (!process.env.SANITY_STUDIO_API_VERSION)
  throw new Error('SANITY_STUDIO_API_VERSION not defined');
if (!process.env.SANITY_STUDIO_API_READ_TOKEN)
  throw new Error('SANITY_STUDIO_API_READ_TOKEN not defined');

export const STUDIO_API_VERSION = process.env.SANITY_STUDIO_API_VERSION;
export const STUDIO_BASE_URL = process.env.SANITY_STUDIO_BASE_URL;
export const STUDIO_API_READ_TOKEN = process.env.SANITY_STUDIO_API_READ_TOKEN;

export const STUDIO_CONFIG = {
  ...STUDIO_CONFIG_CLIENT,
  apiVersion: STUDIO_API_VERSION,
};
