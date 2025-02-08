import { vercelStegaDecode, vercelStegaSplit } from '@vercel/stega';
import { mapValues } from 'lodash';
import { stegaClean } from 'next-sanity';

import { useContext } from 'react';

import { StegaContext } from '@/context/stega';
import { STUDIO_BASE_URL } from '@/lib/env.client';

export function useStega() {
  return useContext(StegaContext);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processObject = (o?: any): any => {
  if (!o) return o;
  if (typeof o === 'string') return stegaClean(o);
  if (Array.isArray(o)) return o.map(processObject);
  if (typeof o === 'object') {
    return mapValues(o, processObject);
  }
  return o;
};

export function useStegaValueDecode(o?: string) {
  const stega = useStega();
  if (!o) return undefined;
  const decoded: { href?: string } | undefined = vercelStegaDecode(o);
  console.log(decoded?.href);
  return (
    (stega &&
      decoded?.href
        ?.split(/;/g)
        .slice(1)
        .join(';')
        .replace(
          /\?baseUrl=.*?$/,
          `;base=${encodeURIComponent(STUDIO_BASE_URL || '/')}`
        )) ||
    undefined
  );
}

export function useStegaValueSplit(o?: string) {
  const stega = useStega();
  if (!o) return undefined;
  const split = vercelStegaSplit(o);
  return { ...split, encoded: stega ? split.encoded : '' };
}

export function useStegaValue<T>(o: T): T {
  const stega = useStega();
  if (o === undefined) return o;
  return stega === false ? processObject(o) : o;
}
