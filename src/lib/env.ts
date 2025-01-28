if (!process.env.SANITY_STUDIO_PROJECT_ID)
  throw new Error('SANITY_STUDIO_PROJECT_ID not defined');
if (!process.env.SANITY_STUDIO_DATASET)
  throw new Error('SANITY_STUDIO_DATASET not defined');
if (!process.env.SANITY_STUDIO_API_VERSION)
  throw new Error('SANITY_STUDIO_API_VERSION not defined');
if (!process.env.SANITY_STUDIO_API_READ_TOKEN)
  throw new Error('SANITY_STUDIO_API_READ_TOKEN not defined');

export const STUDIO_PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID;
export const STUDIO_DATASET = process.env.SANITY_STUDIO_DATASET;
export const STUDIO_API_VERSION = process.env.SANITY_STUDIO_API_VERSION;
export const STUDIO_BASE_URL = process.env.SANITY_STUDIO_BASE_URL;
export const STUDIO_API_READ_TOKEN = process.env.SANITY_STUDIO_API_READ_TOKEN;

export const STUDIO_CONFIG = {
  projectId: STUDIO_PROJECT_ID,
  dataset: STUDIO_DATASET,
  apiVersion: STUDIO_API_VERSION,
};
