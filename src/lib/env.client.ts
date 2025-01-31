if (!process.env.NEXT_PUBLIC_SANITY_STUDIO_PROJECT_ID)
  throw new Error('NEXT_PUBLIC_SANITY_STUDIO_PROJECT_ID not defined');
if (!process.env.NEXT_PUBLIC_SANITY_STUDIO_DATASET)
  throw new Error('NEXT_PUBLIC_SANITY_STUDIO_DATASET not defined');

export const STUDIO_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_PROJECT_ID;
export const STUDIO_DATASET = process.env.NEXT_PUBLIC_SANITY_STUDIO_DATASET;

export const STUDIO_CONFIG = {
  projectId: STUDIO_PROJECT_ID,
  dataset: STUDIO_DATASET,
};
