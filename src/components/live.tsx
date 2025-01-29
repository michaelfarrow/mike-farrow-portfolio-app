import { VisualEditing } from 'next-sanity';

import { draftMode } from 'next/headers';

import { SanityLive } from '@/lib/sanity/live';

import { DisableDraftMode } from '@/components/DisableDraftMode';

export async function Live() {
  return (
    <>
      <SanityLive />
      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
    </>
  );
}
